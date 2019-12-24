"use strict";

const path = require("path")
const cp = require("child_process")

// 根路径
let root
if (process.platform === "win32") {
  root =
    process.env.USERPROFILE ||
    process.env.APPDATA ||
    process.env.TMP ||
    process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || "/tmp";
}

let prefix = null;
try {
  prefix = cp
    .execSync("npm config get prefix")
    .toString()
    .trim();
} catch (err) {
  // ignore it
  debug("npm config cli error: %s", err);
}

module.exports = {
  fnpmRegistry: "http://localhost:8081/repository/npm-group/",
  fnpmHostedRegistry: "http://localhost:8081/repository/npm-hosted/",
  cnpmRegistry: "https://registry.npm.taobao.org", // check命令调用cnpm的接口
  disturl: "https://npm.taobao.org/mirrors/node", // download dist tarball for node-gyp
  iojsDisturl: "https://npm.taobao.org/mirrors/iojs",
  cache: path.join(root, ".fnpm"), // cache folder name
  userconfig: path.join(root, ".fnpmrc"),
  proxy: "",
  prefix: prefix
};
