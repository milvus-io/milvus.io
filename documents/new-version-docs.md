# Add a New Version Documents

`NEW_VERSION`: The version that you want to add eg: `v2.6.x`
`CURRENT_VERSION`: Current latest version eg: `v2.5.x`
`PREV_VERSION`: The previous version eg: `v2.4.x`

if you want to add a new version documents eg: `v2.6.x`

Please refer to the following steps：

- Make sure that the corresponding version of the directory is already in the `web-content`

  - Generate the English documentation in the `localization` directory
  - Copy the generated 'en' directory to 'zh', 'ja', 'ko', 'fr', 'de', 'it', 'pt', 'es', and the other 8 languages

- milvus.io/src/pages/docs
  - Copy an existing version directory `PREV_VERSION` to `CURRENT_VERSION`. eg: copy v2.4.x v2.5.x
  - Modify the `createDocHomeProps` method's version parameters in the files within the `CURRENT_VERSION` directory.
  - Create a `CURRENT_VERSION` directory in the zh, ja, ko, fr, de, it, pt, and es directories. Copy from the existing directory and update the version parameters in `createDocHomeProps`.
  - Update `SHOW_LANGUAGE_SELECTOR_VERSIONS` param in `src/components/localization/const`, Control which versions display language selectors
