import Koa from "koa";
import koaBody from "koa-body";
import Router from "@koa/router";
import chokidar from "chokidar";
import { config } from "./config";
import { register } from "./handler/register/importIPA";
import { generate } from "./generate";
import * as _ from "lodash";
import serve from "koa-static";
import auth from "koa-basic-auth";
import { Log } from "./utils/Log";

const app = new Koa();
const router = new Router();

router.post("/register", koaBody({ multipart: true }), register);

router.get("/apps.json", serve(`${config.rootDir}/public/assets`));

router.get("/assets/(.*)", serve(`${config.rootDir}/public/`));

router.get("/", serve(`${config.rootDir}/public/`));
router.get("/favicon.ico", serve(`${config.rootDir}/public/`));
router.get("/global.css", serve(`${config.rootDir}/public/`));
router.get("/build/(.*)", serve(`${config.rootDir}/public/`));

// register ipa page
if (config.admin.name && config.admin.pass) {
  router.get(
    "/admin.html",
    auth({ name: config.admin.name, pass: config.admin.pass }),
    serve(`${config.rootDir}/public/`)
  );
}

app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port);

// watch assets dir
const watcher = chokidar.watch(`${config.rootDir}/public/assets`, {
  ignored: /[\/\\]\.|apps.json/,
  persistent: true,
});

const WAIT_MS = 30000;

watcher.on("ready", function () {
  console.log("ready watching...");

  watcher.on("all", (eventName, path) => {
    Log.info(`detected ${eventName} event: ${path}`);
    _.debounce(generate, WAIT_MS);
  });
});
