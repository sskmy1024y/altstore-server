import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  host: string;
  storeName: string;
  port: number;
  debugLogging: boolean;
  country: string;
  identifier: string;
  rootDir: string;
  useItunesSearch: boolean;
  admin: {
    name: string | undefined;
    pass: string | undefined;
  };
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  host: process.env.HOST || "localhost",
  storeName: process.env.STORE_NAME || "Example Store",
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  country: process.env.COUNTRY?.toLowerCase() || "EN",
  identifier: process.env.IDENTIFIER || "com.example.store",
  rootDir: process.cwd(),
  useItunesSearch: Boolean(process.env.USE_ITUNES_SEARCH || false),
  admin: {
    name: process.env.ADMIN_NAME,
    pass: process.env.ADMIN_PASS,
  },
};

export { config };
