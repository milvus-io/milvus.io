[![Build Status](https://dev.azure.com/zhifengzhang/www/_apis/build/status/milvus-www%20-%20CI?branchName=master)](https://dev.azure.com/zhifengzhang/www/_build/latest?definitionId=2&branchName=master)

www.milvus.io Official website

## local development set up

0. git submodule sync
1. yarn install
1. yarn start

## Preview

preview site: https://milvus-io.azurewebsites.net/

## how to contribution

1. fork the repo
2. checkout the preview branch
3. create a new feature branch based on the preview branch
4. pull request to the preview branch

### This site is built with Gatsbyjs, please check https://www.gatsbyjs.org/docs/ for reference

## submodule - master branch must be the newest verison

add new version doc (branch in repo)

```
    git submodule add -b your-version-branch https://github.com/milvus-io/docs.git src/pages/docs/versions/your-version-branch
    git submodule add -b v0.6.0 https://github.com/milvus-io/docs.git src/pages/docs/versions/v0.6.0
    git submodule add -b master https://github.com/milvus-io/docs.git src/pages/docs/versions/master
    git submodule add -b master https://github.com/milvus-io/community.git src/pages/blogs/versions/master
```

// add benchmark doc
git submodule add -b 0.10.0 https://github.com/milvus-io/benchmarks.git static/benchmarks
