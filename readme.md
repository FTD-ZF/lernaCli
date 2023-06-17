cli 入口文件
command 命令基础类
init 项目初始化命令
utils 工具类


cli下执行 
npm link   让入口文件生效 脚手架命令全局安装
lerna add import-local packages/cli
lerna add npmlog packages/cli
lerna add commander packages/


lerna  create  command

lerna add @ftd-zf/command packages/init
lerna add @ftd-zf/init packages/cli

lerna create utils
lerna add npmlog packages/utils

lerna add @ftd-zf/utils packages/cli
lerna add semver packages/cli  比较版本号大小

lerna add chalk packages/cli

lerna add dirname-filename-esm packages/cli
lerna add fs-extra packages/cli

lerna add @ftd-zf/utils packages/init

lerna add inquirer packages/utils
lerna add url-join packages/utils
lerna add axios packages/utils
lerna add path-exists packages/init
lerna add fs-extra packages/init
lerna add ora packages/init 进度条 loading
lerna add execa packages/init

lerna add @ftd-zf/data packages/init