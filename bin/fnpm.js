#!/usr/bin/env node

"use strict";

const match = require("auto-correct");
const spawn = require("cross-spawn");
const path = require("path");
const parseArgv = require("../lib/parse_argv");

// 获取整理后的参数
const program = parseArgv();
const rawArgs = program.rawArgs.slice(2);
const args = [];
let isInstall = false;

for (let i = 0; i < rawArgs.length; i++) {
  let arg = rawArgs[i];

  //判断是否指定的命令
  if (arg[0] !== "-") {
    arg = correct(arg);
  }

  //第一位为install,则改变isInstall == true
  if (i === 0 && (arg === "i" || arg === "install")) {
    isInstall = true;
    continue;
  }

  args.push(arg);
}

function correct (command) {
  const cmds = [
    "install",
    "publish",
    "adduser",
    "author",
    "config",
    "unpublish"
  ];
  for (const cmd of cmds) {
    if (match(command, cmd)) {
      return cmd;
    }
  }
  return command;
}

// 插入源
args.unshift(`--registry=${program.registry}`);

//插入配置
program.userconfig && args.unshift(`--userconfig=${program.userconfig}`);

isInstall && args.unshift("install");


//npm命令所需要的系统参数
const env = Object.assign({}, process.env);
const CWD = process.cwd();
const stdio = [process.stdin, process.stdout, process.stderr];
const execMethod = spawn;

const npmBin = path.join(__dirname, "../", "node_modules", ".bin", "npm");
const child = execMethod(npmBin, args, {
  env: env,
  cwd: CWD,
  stdio: stdio
});

child.on("exit", (code, signal) => {
  process.exit(code);
});
