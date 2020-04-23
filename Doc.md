## 文档根据github的分支生成，版本号最大的分支即为主分支，生成home页面的文档链接，master分支与官网无关。 
以下示例都来自于v0.7.1

## 目录结构
```js
## Folder and Files structure
v0.7.1 // branch name 必须要v开头
|- assets                   // md中使用的图片
|- site                     // 所有md文件
  |- en                     //  英文目录 
    |- menuStructure        // 重要！！ 用来生成英文菜单
      |- en.json
  |- zh-CN                     //  中文目录
    |- menuStructure        // 重要！！ 用来生成中文菜单
      |- cn.json
|- version.json             //  用来控制是否发布
```

1. 每个branch下都需要有version.json, 其中version表示版本号.
```js
  {
    "version": "v0.7.1", // 同branch名
    "released": "yes"  // yes | no 表示是否会发布到官网
  }
```

2. markdown 中的tag
```
---
id: overview.md // 必须加上.md 这样才可以使网站和github中link同步。

---
``` 

3. menuStructure/zh-CN 下的cn.json文件
```js
{
  "menuList": [
    {
      "id": "about_milvus", // 唯一id 用于跳转 或者 子菜单归属
      "title": "关于 Milvus", // 菜单中 title
      "lang": "en", // 这个可以不用 以前遗留
      "label1": "", // 填写上级菜单 id 不填为一级菜单
      "label2": null, // 填写上级菜单 id
      "label3": null, // 填写上级菜单 id 现在最多支持4级 - 即三个父菜单
      "order": 0, // 菜单显示顺序，不同的菜单层级不会相互干扰。 从0开始 - 为0到显示在首页
      "isMenu": true // 控制是link还是仅仅是一个text， true的话不可跳转，没有这个字段就是链接
    },
    {
      "id": "overview.md", // 需要跳转到markdown，需要对应markdown.
      "title": "Milvus 简介",
      "label1": "about_milvus", // 表示 overview.md 属于 about_milvus的子菜单
      "label2": null, 
      "label3": null,
      "order": 0,
    },
     {
      "id": "",
      "title": "在线训练营",
      "lang": "en",
      "label1": "",
      "label2": null,
      "label3": null,
      "order": 4,
      "outLink": "https://github.com/milvus-io/bootcamp" // 外链 跳转到其他网站时使用
    },
  ]
}

```
