document.addEventListener('DOMContentLoaded', ()=>{
    // $('tbody').on('click', 'tr', event => console.log($(event.target).html()))

    const trs = document.querySelectorAll('tr');
    [].forEach.call(trs, tr => tr.addEventListener('click', ()=>{
        const classname = event.currentTarget.className;
        const content = document.getElementById(classname);
        content.style.display = content.style.display == 'none' ? 'table-row': 'none';
    }))

    const nav = document.querySelector('.toc');
    if (!nav) return;

    const lis = nav.querySelectorAll('li');
    const downloadlink = document.createElement('div');
    downloadlink.innerHTML = '<a class="edit-page-link button" target="_blank" href="/milvus.doc.pdf">Download PDF</a>';
    const last = lis[lis.length - 1];

    last.parentNode.appendChild(downloadlink)
});