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

    const createDownloadPdfElement = node => {
        const parent = node.parentNode;
        const arr = window.location.href.split('/');
        const targetName = arr[arr.length-1];
        const targetLink = `/${targetName}.md.pdf`
        
        const downloadlink = document.createElement('div');
        downloadlink.innerHTML = `
            <a class="edit-page-link button" style="margin-left:10px !important;" target="_blank" href= ${targetLink} >
                <svg t="1561693018077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="643" width="10" height="10"><path d="M135.998 875.888V84.837h341.428v254.058H731.56v234.663h69.098V308.687c0.35-2.822 0.35-5.668 0-8.489v-10.516L525.848 15.739H66.9v929.247h616.965l-60.056-69.098H135.998z m410.525-606.091V133.438L682.41 269.797H546.523z" p-id="644" fill="#33b6f2"></path><path d="M839.756 768.716V592.777H672.914v175.939H557.263l203.112 233.733 194.077-233.733H839.756z m-136.737 69.098h38.993V661.875h28.646v175.939h40.93l-51.952 60.317-56.617-60.317z" p-id="645" fill="#33b6f2"></path><path d="M175.86 718.739c-4.879 8.879-6.816 21.902-2.355 33.547 4.443 11.598 13.645 19.208 23.166 24.175 7.119 3.741 14.632 5.339 22.113 5.339 13.688 0 27.271-5.346 38.157-12.692 16.849-11.37 31.883-27.976 46.957-48.254 7.633-10.269 13.685-26.928 21.147-38.93 24.077-10.704 138.583-49.268 173.168-56.81 28.971 19.56 59.788 34.653 93.385 34.653 19.027 0 33.712-0.799 48.062-8.603 14.35-7.804 23.022-26.547 23.022-40.853 0-11.656-5.136-24.004-13.217-32.009-8.081-8.005-17.749-12.204-27.588-14.851-11.108-2.989-23.049-4.195-35.958-4.195-9.958 0-20.492 0.718-31.665 1.888-13.584 1.423-31.68 8.569-46.764 11.439-1.988-1.613-3.982-2.284-5.96-3.989-30.701-26.46-59.435-63-80.744-99.296-1.315-2.24-1.099-3.672-2.355-5.912 5.165-19.466 15.384-42.003 17.687-59.068 3.173-23.513 3.865-44.1-1.826-62.961-2.846-9.431-7.662-18.895-16.053-26.242-8.391-7.347-20.163-11.343-31.192-11.343-18.513 0-37.586 10.51-46.043 26.002-8.457 15.492-8.948 32.163-6.873 49.456 3.271 27.26 15.659 58.2 31.721 89.732-7.986 26.977-43.64 124.962-61.679 155.428-59.941 18.811-111.566 63.874-128.313 94.349z m274.867-132.315c-25.228 6.721-81.628 22.176-86.896 24.079 7.53-15.643 30.755-70.425 36.047-85.022 15.147 21.844 32.031 42.139 50.849 60.943z m-67.258-232.497l0.024-0.001c2.497 0 4.244 19.002 3.792 30.3-0.588-2.929-10.247-29.987-3.816-30.299zM273.108 691.764s-15.041 22.563-20.191 22.563c-0.307 0-0.578-0.08-0.81-0.25-6.562-4.812-0.874-10.062 21.001-22.313z m310.848-84.407c-0.313 3.175-1.644 4.764-4.452 4.764-4.355 0-12.263-3.819-25.446-11.471 0 0.001 30.399 1.629 29.898 6.707z" p-id="646" fill="#33b6f2"></path></svg>
                &nbsp;Download PDF 
            </a>`;
        parent.insertBefore(downloadlink, node)
        return false;
    }
    const editButtonEle = document.querySelector('.edit-page-link');
    if(editButtonEle) createDownloadPdfElement(editButtonEle);
});