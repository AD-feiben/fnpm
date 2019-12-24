"use strict";

const fs = require("fs");
const path = require("path");
const program = require("commander");
const config = require("./config");
const pkg = require("../package.json");

let argv = null;

module.exports = () => {
  argv = program
          .version(pkg.version)
          .option("-r, --registry <registry>", "set fnpm registry");

  program.on('--help', function () {
    help();
  })

  program.parse(process.argv);

  //如果有自己传进来,就用自己传的,否则使用config里面默认的
  //自定义配置路径
  argv.userconfig = argv.userconfig || config.userconfig;

  // 源
  if (program.registry) {
    argv.registry = program.registry;
  } else if (isHostCMD()) {
    // 使用私服仓库
    argv.registry = getDefaultRegistry() || config.fnpmHostedRegistry;
  } else if (!argv.registry) {
    // try to use registry in uerconfig
    argv.registry = getDefaultRegistry() || config.fnpmRegistry;
  }

  if (argv.userconfig === "none") {
    delete argv.userconfig;
  }

  // 去除 userconfig, registry 参数
  const filterCMD = ['--userconfig=', '-u=', '--registry=', '-r='];
  const rawArgs = argv.rawArgs.filter((arg) => {
    return filterCMD.every(cmd => {
      return arg.indexOf(cmd) === 0;
    }) === false;
  })

  argv.rawArgs = rawArgs;
  return argv;
}

// 登录，登出，发布，取消发布
function isHostCMD () {
  const hostedCMD = ['publish', 'unpublish', 'login', 'logout', 'add-user', 'adduser'];
  return hostedCMD.indexOf(argv.rawArgs[2]) > -1;
}

function help() {
  const helpInfo = `

Usage: npm <command>

where <command> is one of:
    access, adduser, audit, bin, bugs, c, cache, ci, cit,
    completion, config, create, ddp, dedupe, deprecate,
    dist-tag, docs, doctor, edit, explore, get, help,
    help-search, hook, i, init, install, install-test, it, link,
    list, ln, login, logout, ls, outdated, owner, pack, ping,
    prefix, profile, prune, publish, rb, rebuild, repo, restart,
    root, run, run-script, s, se, search, set, shrinkwrap, star,
    stars, start, stop, t, team, test, token, tst, un,
    uninstall, unpublish, unstar, up, update, v, version, view,
    whoami

npm <command> -h  quick help on <command>
npm -l            display full usage info
npm help <term>   search for help on <term>
npm help npm      involved overview

Specify configs in the ini-formatted file:
    /Users/admin/.npmrc
or on the command line via: npm <command> --key value
Config info can be viewed via: npm help config
`;

  console.log(helpInfo);
};

//获取源路径
function getDefaultRegistry() {
  if (argv.userconfig !== "none" && fs.existsSync(argv.userconfig)) {
    var content = fs.readFileSync(argv.userconfig, "utf8");
    // registry = {registry-url}
    var m = /^registry\s*=\s*(.+)$/m.exec(content);
    if (m) {
      return m[1];
    }
  }
  return null;
};