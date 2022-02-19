import { promises as fs } from "fs";
import plist from "plist";
import { config } from "../config";
import { exec } from "./Promise";

export const getInfoPlist = async (ipaPath: string) => {
  const result = await exec(`unzip -o ${ipaPath} "Payload/*.app/Info.plist"`);
  const path = `${config.rootDir}/${
    result.stdout.match(/inflating: (.*plist)/)?.[1]
  }`;
  const plistfile = await fs.readFile(path, "utf-8");
  const content = plist.parse(plistfile) as { [x: string]: any };
  await exec(`rm -rf ${config.rootDir}/Payload`);
  return content;
};
