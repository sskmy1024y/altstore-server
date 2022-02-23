import fs from "fs";
import path from "path";
import { config } from "../config";
import { AppInfo } from "../model/AppInfo";
import { AppsJSON } from "../model/AppsJSON";
import { getInfoPlist } from "../utils/InfoPlist";
import { Log } from "../utils/Log";
import { createAppInfo } from "./createAppInfo";

export const generate = async () => {
  Log.info("start - generate app.json");
  try {
    const ipafiles = await filterByBundleID(
      searchIPAFiles(`${config.rootDir}/public/assets`)
    );

    const appInfos = await Promise.all(
      ipafiles.map(async (ipaPath) => await createAppInfo(ipaPath))
    );
    await createAppJson(
      appInfos.filter((v): v is AppInfo => typeof v !== undefined)
    );
    Log.info("end - generate app.json success");
  } catch (e: unknown) {
    if (e instanceof Error) {
      Log.error("generate app.json error:", e);
    }
  }
};

const searchIPAFiles = (dirpath: string): string[] => {
  const dirents = fs.readdirSync(dirpath, { withFileTypes: true });
  return dirents.reduce<string[]>((prev, dirent) => {
    const fp = path.join(dirpath, dirent.name);
    if (dirent.isDirectory()) {
      return [...prev, ...searchIPAFiles(fp)];
    } else if (dirent.isFile() && fp.endsWith(".ipa")) {
      Log.info(`found ipa file: ${fp}`);
      return [...prev, fp];
    } else {
      return prev;
    }
  }, []);
};

const filterByBundleID = async (ipafiles: string[]): Promise<string[]> => {
  const detailInfo = await Promise.all(
    ipafiles.map<
      Promise<{ ipafile: string; bundleID: string; version: string }>
    >(async (ipafile) => {
      const infoPlist = await getInfoPlist(ipafile);
      const version = infoPlist["CFBundleVersion"];
      const bundleID = infoPlist["CFBundleIdentifier"];

      return {
        ipafile,
        bundleID,
        version,
      };
    })
  );

  const filteredInfo = detailInfo.reduce<
    { ipafile: string; bundleID: string; version: string }[]
  >((prev, info) => {
    const prevInfo = prev.find((v) => v.bundleID === info.bundleID);
    if (prevInfo) {
      if (info.version > prevInfo.version) {
        return [...prev.filter((v) => v.bundleID !== info.bundleID), info];
      } else {
        return prev;
      }
    } else {
      return [...prev, info];
    }
  }, []);

  return filteredInfo.map((v) => v.ipafile);
};

const createAppJson = async (appInfos: AppInfo[]) => {
  const sourceURL = encodeURI(`${config.host}/apps.json`);

  const appsJson: AppsJSON = {
    name: config.storeName,
    identifier: config.identifier,
    sourceURL,
    apps: appInfos,
    news: [],
  };

  await fs.writeFileSync(
    `${config.rootDir}/public/assets/apps.json`,
    JSON.stringify(appsJson),
    "utf-8"
  );
};
