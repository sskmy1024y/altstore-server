export const Log = {
  info: (value: string, error?: Error) => {
    if (typeof error !== "undefined") {
      console.log(`[INFO] ${value}`, error);
    } else {
      console.log(`[INFO] ${value}`);
    }
  },
  warn: (value: string, error?: Error) => {
    if (typeof error !== "undefined") {
      console.warn(`[WARN] ${value}`, error);
    } else {
      console.warn(`[WARN] ${value}`);
    }
  },
  error: (value: string, error: Error) => {
    console.error(`[ERROR] ${value}`, error);
  },
};
