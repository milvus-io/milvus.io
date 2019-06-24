document.addEventListener('DOMContentLoaded', ()=>{
    const nav = document.querySelector('.toc');
    if (!nav) return;

    const lis = nav.querySelectorAll('li');
    const downloadlink = document.createElement('div');
    downloadlink.innerHTML = '<a class="edit-page-link button" target="_blank" href="/milus.doc.pdf">Download PDF</a>';
    const last = lis[lis.length - 1];

    last.parentNode.appendChild(downloadlink)
});