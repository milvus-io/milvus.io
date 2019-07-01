const fs = require('fs');
const [, , folder, lang='en', file ='README.md' ] = process.argv;
const tocFile = `${folder}/${file}`;
if (!fs.existsSync(tocFile)) {
    console.log(`${tocFile} is not exist`);
}

const markdown = fs.readFileSync(`${tocFile}`).toString();
const titleReg = new RegExp(/#(.*\n)/);
let pdf = `%` + markdown.match(titleReg)[1] + `\n`;
const linksRegexp = new RegExp(/\((.*\.md)/g);

const links = markdown.match(linksRegexp).map(d => d.replace('(', ''));
const removeFormatter = /^---(.|\n)*?---\n/;
const yesMap = {
    'en': 'Yes',
    'zh-CN': '是'
};
const noMap = {
    'en': 'No',
    'zh-CN': '否'
}
links.forEach(link => {
    const file = fs.readFileSync(`${folder}/${link}`).toString();
    pdf += file.replace(removeFormatter, '')
                    .replace(/:heavy_check_mark:/g, yesMap[lang])
                    .replace(/:x:/g, noMap[lang]);
});

fs.writeFileSync(`./${folder}.all.md`, pdf);
