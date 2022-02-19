import { AppInfo } from "./AppInfo";
import { News } from "./News";

export interface AppsJSON {
  name: string; // Store Name
  identifier: string;
  sourceURL: string;
  apps: AppInfo[];
  news: News[];
}
