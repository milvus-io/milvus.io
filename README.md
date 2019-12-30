[![Build Status](https://dev.azure.com/zhifengzhang/www/_apis/build/status/milvus-www%20-%20CI?branchName=master)](https://dev.azure.com/zhifengzhang/www/_build/latest?definitionId=2&branchName=master)

www.milvus.io Official website 

## local development set up

1. yarn install
2. yarn start

### This site is built with Gatsbyjs, please check https://www.gatsbyjs.org/docs/ for reference

## submodule - master branch must be the newest verison

add new version doc (branch in repo)

```
    git submodule add -b your-version-branch https://github.com/milvus-io/docs.git src/pages/docs/versions/your-version-branch
    git submodule add -b v0.6.0 https://github.com/milvus-io/docs.git src/pages/docs/versions/v0.6.0
    git submodule add -b master https://github.com/milvus-io/docs.git src/pages/docs/versions/master
    git submodule add -b master https://github.com/milvus-io/community.git src/pages/blogs/versions/master
```
