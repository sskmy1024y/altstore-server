export interface AppInfo {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  version: string;
  versionDate: string;
  versionDescription: string;
  downloadURL: string;
  localizedDescription: string;
  iconURL: string;
  tintColor: string; // hex color e.g. `8A28F7`
  size: number;
  screenshotURLs: string[];
  beta?: boolean;
  permissions: AppPermissions[];
}

export interface AppPermissions {
  type:
    | "background-fetch"
    | "background-audio"
    | "photos"
    | "camera"
    | "music"
    | "motion"
    | "microphone"
    | "bluetooth"
    | "network"
    | "faceid"
    | "calendars"
    | "contacts"
    | "speech-recognition"
    | "location";
  usageDescription: string;
}
