### 使用（支持 node 版本 15+）

npm i @ftd-zf/cli -g

### 命令

1. ftdcli init projectname
   初始化项目模版
2. ftdcli taropage pagename
   新建 Taro 页面模块
3. ftdcli tarocomponent componentname
   新建 Taro 组件模块
4. ftdcli gen
   根据 swagger 文档自动化生成前端 service 代码
5. ftdcli oss
   将资源上传阿里 OSS
6. ftdcli lint
   对项目进行代码检查，并生成检查结果文件
7. fdtcli taropage-all
   根据配置文件，生成所有 Taro 页面

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

##### template.config.json 配置文件参数说明

1. openApi 中 （可配置多个 swagger json 文档）

| 参数           | 描述                                    |
| -------------- | --------------------------------------- |
| requestLibPath | 当前请求方法文件相对路径                |
| schemaPath     | swagger json 文档（本地文件或在线地址） |
| projectName    | 生成文件名                              |
| serversPath    | 生成文件相对路径                        |

2. upload 中 dir（可配置多个上传文件）

| 参数        | 描述                           |
| ----------- | ------------------------------ |
| assestDir   | 本地需要上传资源文件的相对路径 |
| ossFileName | 上传资源文件名                 |

3. upload 中 aliOSS （参考阿里 oss 参数配置信息）

##### 相关说明

- ftdcli gen 和 ftdcli oss 需要配置文件 template.config.json 才能进行使用，均为项目根目录执行命令

- ftdcli taropage [pagename] 创建页面 需要在 Taro 项目下，pages 文件夹下进行操作，同时在 pages 目录下生成 nav.js 文件，用于项目中页面跳转使用

- ftdcli tarocomponent [componentname] 创建组件 在 Taro 项目中即可使用

- ftdcli oss 命令仅用于上传资源，项目中还需将本地资源的引用路径转化为 oss 线上地址（可用插件 <https://github.com/FTD-ZF/babel-plugin-replace-assets-with-url>）

##### 配置文件 template.page.json，如下：

```
[
   {
    "title": "home",
    "description": "主页",
    "children": [
      {
        "title": "detail",
        "description": "详情",
        "children": [
          {
            "title": "detail1",
            "description": "详情1"
          }
        ]
      }
    ]
   },
   {
    "title": "mine",
    "description": "个人中心",
    "children": [
      {
        "title": "setting",
        "description": "设置"
      },
      {
        "title": "info",
        "description": "个人信息"
      }
    ]
   }
]
```
