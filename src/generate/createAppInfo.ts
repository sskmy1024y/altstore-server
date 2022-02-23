import fs from "fs";
import fetch from "node-fetch";
import { AppInfo, AppPermissions } from "../model/AppInfo";
import { SearchAPIResult, SearchResult } from "../model/SearchAPI";
import { getInfoPlist } from "../utils/InfoPlist";
import Vibrant from "node-vibrant";
import { config } from "../config";
import path from "path";
import rgbHex from "rgb-hex";
import { Log } from "../utils/Log";

export const createAppInfo = async (ipaPath: string) => {
  const infoPlist = await getInfoPlist(ipaPath);
  const dotcache = await getDotCache(ipaPath);

  if (dotcache === undefined) {
    const searchResult = await fetchAppInfoFromiTunesSearchAPI(
      infoPlist["CFBundleName"],
      infoPlist["CFBundleIdentifier"]
    );
    const appInfo = await generateAppInfo(ipaPath, infoPlist, searchResult);
    Log.info(`app info cache is generated for ${ipaPath}`);
    return appInfo;
  } else {
    Log.info(`using cache info for ${ipaPath}`);
    return dotcache;
  }
};

const getDotCache = async (ipaPath: string) => {
  const cachePath = `${path.dirname(ipaPath)}/.cache`;
  if (fs.existsSync(cachePath)) {
    const cachefile = await fs.readFileSync(cachePath, "utf-8");
    return JSON.parse(cachefile) as AppInfo;
  }
};

const saveDotCache = async (ipaPath: string, appInfo: AppInfo) => {
  const cachePath = `${path.dirname(ipaPath)}/.cache`;
  await fs.writeFileSync(cachePath, JSON.stringify(appInfo), "utf-8");
};

const fetchAppInfoFromiTunesSearchAPI = async (
  bundleName: string,
  bundleId: string
) => {
  const result = await fetch(
    `https://itunes.apple.com/search?term=${bundleName}&country=${config.country}&entity=software`
  );
  try {
    const info = (await result.json()) as SearchAPIResult;
    const appInfo = info.results.find((v) => v.bundleId === bundleId);
    return appInfo;
  } catch {
    return undefined;
  }
};

const getTintColor = async (iconPath: string | undefined) => {
  const defaultColor = "007AFF";
  if (!iconPath) return defaultColor;

  const palette = await Vibrant.from(iconPath).getPalette();
  const rgb = palette.Vibrant?.rgb;
  if (rgb) {
    const [r, g, b] = rgb;
    return rgbHex(r, g, b);
  }
  return defaultColor;
};

const generateAppInfo = async (
  ipaPath: string,
  infoPlist: { [x: string]: any },
  searchResult?: SearchResult
): Promise<AppInfo> => {
  const size = fs.statSync(ipaPath).size;
  const tintColor = await getTintColor(searchResult?.artworkUrl100);
  const downloadURL = ipaPath.replace(
    `${config.rootDir}/public`,
    `${config.host}`
  );
  const localizedDescription = searchResult?.description ?? "";
  const versionDate = searchResult?.currentVersionReleaseDate ?? "";

  const appInfo = {
    name: infoPlist["CFBundleName"],
    bundleIdentifier: infoPlist["CFBundleIdentifier"],
    developerName: searchResult?.artistName ?? "",
    version: infoPlist["CFBundleVersion"],
    versionDate,
    versionDescription: searchResult?.releaseNotes ?? "",
    downloadURL,
    localizedDescription,
    iconURL: searchResult?.artworkUrl100 ?? "",
    tintColor,
    size,
    screenshotURLs: searchResult?.screenshotUrls ?? [],
    beta: false,
    permissions: getAppPermission(infoPlist),
  };

  await saveDotCache(ipaPath, appInfo);
  return appInfo;
};

const getAppPermission = (infoPlist: {
  [x: string]: any;
}): AppPermissions[] => {
  const appPermissions: AppPermissions[] = [];
  if (infoPlist["NSCameraUsageDescription"]) {
    appPermissions.push({
      type: "camera",
      usageDescription: infoPlist["NSPhotoLibraryUsageDescription"],
    });
  }
  if (infoPlist["NSPhotoLibraryUsageDescription"]) {
    appPermissions.push({
      type: "photos",
      usageDescription: infoPlist["NSPhotoLibraryUsageDescription"],
    });
  }
  if (
    infoPlist["NSLocationAlwaysAndWhenInUseUsageDescription"] ||
    infoPlist["NSLocationAlwaysUsageDescription"]
  ) {
    appPermissions.push({
      type: "location",
      usageDescription:
        infoPlist["NSLocationAlwaysAndWhenInUseUsageDescription"] ??
        infoPlist["NSLocationAlwaysUsageDescription"],
    });
  }
  if (infoPlist["NSContactsUsageDescription"]) {
    appPermissions.push({
      type: "contacts",
      usageDescription: infoPlist["NSContactsUsageDescription"],
    });
  }
  if (infoPlist["NSLocalNetworkUsageDescription"]) {
    appPermissions.push({
      type: "network",
      usageDescription: infoPlist["NSLocalNetworkUsageDescription"],
    });
  }
  if (infoPlist["NSMicrophoneUsageDescription"]) {
    appPermissions.push({
      type: "microphone",
      usageDescription: infoPlist["NSMicrophoneUsageDescription"],
    });
  }
  if (infoPlist["NSAppleMusicUsageDescription"]) {
    appPermissions.push({
      type: "music",
      usageDescription: infoPlist["NSAppleMusicUsageDescription"],
    });
  }
  if (infoPlist["NSBluetoothPeripheralUsageDescription"]) {
    appPermissions.push({
      type: "bluetooth",
      usageDescription: infoPlist["NSBluetoothPeripheralUsageDescription"],
    });
  }

  if (infoPlist["UIBackgroundModes"]) {
    if ((infoPlist["UIBackgroundModes"] as string[]).includes("audio")) {
      appPermissions.push({
        type: "background-audio",
        usageDescription: "",
      });
    }
    if ((infoPlist["UIBackgroundModes"] as string[]).includes("fetch")) {
      appPermissions.push({
        type: "background-fetch",
        usageDescription: "",
      });
    }
  }
  return appPermissions;
};
