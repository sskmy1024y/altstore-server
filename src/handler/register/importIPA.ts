import { promises as fs } from "fs";
import { Context } from "koa";
import mime from "mime";
import { config } from "../../config";
import { getInfoPlist } from "../../utils/InfoPlist";
import { Log } from "../../utils/Log";
import { exec } from "../../utils/Promise";
import shellescape from "shell-escape";

export const register = async (ctx: Context) => {
  try {
    if (ctx.request.files === undefined) throw new Error("Require ipa file.");

    const ipafile = ctx.request.files.ipafile;
    // TODO: arrow multiple files at a time.
    if (Array.isArray(ipafile))
      throw new Error("Only one file is accepted at a time");

    const { type, path, name } = ipafile;
    const fileExtension = mime.getExtension(type ?? "");
    Log.info(`path: ${path}`);
    Log.info(`filename: ${name}`);
    Log.info(`type: ${type}`);
    Log.info(`fileExtension: ${fileExtension}`);

    if (name && name.endsWith(".ipa") && fileExtension === "bin") {
      await explansionIAP(path, name);
      Log.info("upload success");
      ctx.status = 201;
      ctx.body = "uploaded";
    } else {
      throw new Error(`${name} is not supported extention file.`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      Log.error("Regitering error", err);
      ctx.status = 400;
      ctx.body = err.message;
    }
  }
};

const explansionIAP = async (ipaPath: string, filename: string) => {
  const infoPlist = await getInfoPlist(ipaPath);
  const explansionPath = `${config.rootDir}/public/assets/${infoPlist["CFBundleIdentifier"]}/${infoPlist["CFBundleVersion"]}`;
  const cmd = shellescape(["mkdir", "-p", explansionPath]);
  await exec(cmd);
  await fs.copyFile(ipaPath, `${explansionPath}/${filename}`);
};
