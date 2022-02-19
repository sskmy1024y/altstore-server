import fs from "fs";
import path from "path";
import { config } from "../config";
import { AppInfo } from "../model/AppInfo";
import { AppsJSON } from "../model/AppsJSON";
import { Log } from "../utils/Log";
import { sleep } from "../utils/Promise";
import { createAppInfo } from "./createAppInfo";

export const generate = async () => {
  const ipafiles = searchIPAFiles(`${config.rootDir}/public/assets`);

  const appInfos = await Promise.all(
    ipafiles.map(async (ipaPath) => await createAppInfo(ipaPath))
  );
  await createAppJson(
    appInfos.filter((v): v is AppInfo => typeof v !== undefined)
  );
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

const createAppJson = async (appInfos: AppInfo[]) => {
  const sourceURL = `${config.host.replace(/https?:\/\//, "")}/apps.json`;

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
