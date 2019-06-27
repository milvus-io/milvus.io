document.addEventListener('DOMContentLoaded', () => {
    // index comparison table
    const trs = document.querySelectorAll('tr');
    [].forEach.call(trs, tr => tr.addEventListener('click', () => {
        const content = tr.nextSibling;
        if(content.className) content.style.display = content.style.display == 'none' ? 'table-row' : 'none';
    }))

    // multiple language
    // const headerNavCon = document.querySelector('.nav-site');
    // const languageMenu = document.querySelector('.nav-site>span');
    // languageMenu.style.display = 'none';
    // const languageMap = {
    //     'en': 'English',
    //     'zh-CN': '简体中文'
    // };
    // Object.keys(languageMap).forEach(l => {
    //     const li = document.createElement('li');
    //     let href = window.location.pathname.replace(/en|zh-CN/, l);

    //     li.innerHTML = `<a href="${href}" target="_self" data-v="${l}">${languageMap[l]}</a>`;
    //     headerNavCon.appendChild(li);
    // });

    // download pdf 
    const nav = document.querySelector('.toc');
    if (!nav) return;

    const lis = nav.querySelectorAll('li');
    const downloadlink = document.createElement('div');
    downloadlink.innerHTML = '<a class="edit-page-link button" target="_blank" href="/milvus.doc.pdf">Download PDF</a>';
    const last = lis[lis.length - 1];

    last.parentNode.appendChild(downloadlink)

    
});