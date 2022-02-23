import { generate } from "../generate";
import { Log } from "../utils/Log";

export const handleWatcher = async (
  eventName: "add" | "addDir" | "change" | "unlink" | "unlinkDir",
  path: string
) => {
  Log.info(`detected ${eventName} event: ${path}`);
  await generate();
};
