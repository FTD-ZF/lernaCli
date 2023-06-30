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

##### 配置文件参数说明
1. openApi （可配置多个swagger json文档）

| 参数           |  描述                |
| ----------------- | ----------------|
|   requestLibPath  |        当前请求方法文件相对路径     |
|   schemaPath      |         swagger json文档（本地文件或在线地址）     |
|   projectName      |         生成文件名     |
|   serversPath      |         生成文件相对路径     |
|||


2. upload dir（可配置多个上传文件）

| 参数           |  描述                |
| ----------------- | ----------------|
|   assestDir  |       本地需要上传资源文件的相对路径    |
|   ossFileName      |    上传资源文件名   |
|||

3. upload aliOSS （参考阿里oss参数配置信息）


##### 相关说明
```
ftdcli gen 和 ftdcli oss 命令 需要配置文件template.config.json才能进行使用，均为项目根目录执行命令

ftdcli taropage pagename 和ftdcli tarocomponent componentname 在Taro项目中即可使用

```