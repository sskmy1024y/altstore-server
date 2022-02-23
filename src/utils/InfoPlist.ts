import { promises as fs } from "fs";
import plist from "plist";
import { Log } from "./Log";
import { exec } from "./Promise";
import { v4 as uuidv4 } from "uuid";

export const getInfoPlist = async (ipaPath: string) => {
  const tempDir = `/temp/${uuidv4()}/`;
  await exec(`mkdir -p ${tempDir}`);
  try {
    const result = await exec(
      `unzip -o ${ipaPath} "Payload/*.app/Info.plist"`,
      { cwd: tempDir }
    );
    const path = `${tempDir}/${
      result.stdout.match(/(?:inflating|extracting): (.*plist)/)?.[1]
    }`;
    const plistfile = await fs.readFile(path, "utf-8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = plist.parse(plistfile) as { [x: string]: any };
    return content;
  } catch (e) {
    Log.error("getInfoPlist error", e as Error);
    throw e;
  } finally {
    const { stderr } = await exec(`rm -rf ${tempDir}`);
    if (stderr !== "") Log.warn(stderr);
  }
};
