### 使用
npm i @ftd-zf/cli -g

### 命令
1. ftdcli init projectname
初始化项目模版
2. ftdcli taropage pagename
新建Taro页面模块
3. ftdcli tarocomponent componentname
新建Taro组件模块
4. ftdcli gen
根据swagger文档自动化生成前端service代码
5. ftdcli oss
将资源上传阿里OSS
6. ftdcli lint
对项目进行代码检查，并生成检查结果文件

#### 项目根目录 配置文件 template.config.json
```
{
    "openApi": [
        {
            "requestLibPath": "",
            "schemaPath": "",
            "projectName": "",
            "serversPath": ""
        }
    ],
    "upload": {
        "dir": [
            {
                "assestDir": "",
                "ossFileName": ""
            }
        ],
        "aliOSS": {
            "region": "",
            "accessKeyId": "",
            "accessKeySecret": "",
            "bucket": ""
        }
    }
}
```

##### template.config.json配置文件参数说明
1. openApi中 （可配置多个swagger json文档）

| 参数           |  描述                |
| ----------------- | ----------------|
|   requestLibPath  |        当前请求方法文件相对路径     |
|   schemaPath      |         swagger json文档（本地文件或在线地址）     |
|   projectName      |         生成文件名     |
|   serversPath      |         生成文件相对路径     |



2. upload中 dir（可配置多个上传文件）

| 参数           |  描述                |
| ----------------- | ----------------|
|   assestDir  |       本地需要上传资源文件的相对路径    |
|   ossFileName      |    上传资源文件名   |


3. upload中 aliOSS （参考阿里oss参数配置信息）


##### 相关说明

* ftdcli gen 和 ftdcli oss  需要配置文件template.config.json才能进行使用，均为项目根目录执行命令

* ftdcli taropage [pagename] 创建页面 需要在Taro项目下，pages文件夹下进行操作，同时在pages目录下生成nav.js文件，用于项目中页面跳转使用

* ftdcli tarocomponent [componentname] 创建组件 在Taro项目中即可使用

* ftdcli oss 命令仅用于上传资源，项目中还需将本地资源的引用路径转化为oss线上地址（可用插件 <https://github.com/FTD-ZF/babel-plugin-replace-assets-with-url>）


