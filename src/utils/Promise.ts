/* eslint-disable unicorn/filename-case */
import * as util from "util";
import * as childProcess from "child_process";

export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

export const exec = util.promisify(childProcess.exec);

export const spawn = (cmd: string, options?: childProcess.SpawnOptions) => {
  return new Promise<void>((resolve) => {
    const p = childProcess.spawn(cmd, { ...options, stdio: "inherit" });
    p.on("close", (code: any) => {
      resolve();
    });
  });
};
