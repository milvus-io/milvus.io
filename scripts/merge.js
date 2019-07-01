const fs = require('fs');
const [, , folder, file ='README.md'] = process.argv;
const tocFile = `${folder}/${file}`;
console.log('merging tocFile', tocFile);

if (!fs.existsSync(tocFile)) {
    console.log(`${tocFile} is not exist`);
}

const markdown = fs.readFileSync(`${tocFile}`).toString();
const titleReg = new RegExp(/#(.*\n)/);
let pdf = `%` + markdown.match(titleReg)[1] + `\n`;
const linksRegexp = new RegExp(/\((.*\.md)/g);

const links = markdown.match(linksRegexp).map(d => d.replace('(', ''));
links.forEach(link => {
    const file = fs.readFileSync(`${folder}/${link}`).toString();
    pdf += file
});

fs.writeFileSync(`./${folder}.all.md`, pdf);
