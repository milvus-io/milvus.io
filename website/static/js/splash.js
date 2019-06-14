function getOpacity(i) {
    let opacity = Math.random();
    while(opacity > 0.5) {
        opacity = Math.random();
    }
    return opacity;
}

document.addEventListener('DOMContentLoaded', ()=>{
    let container = document.querySelector('.homeContainer');
    if (!container) return;
    let rows = Math.floor(window.screen.height / 42);
    let cols = Math.floor(window.screen.width / 8);
    let fragment = document.createDocumentFragment();
    let parts = Array(rows * cols).fill(1);
    let splash = document.createElement('div');
    splash.className = 'splash';
    fragment.appendChild(splash);
    
    // 获取背景小框框，做动效用
    let elms = [];

    parts.forEach((p, i) => {
        let elm = document.createElement('div');
        elm.className = 's';
        elm.style.borderColor = `#59B5ED`;
        elm.style.opacity = getOpacity();
        elms.push(elm);
        splash.appendChild(elm);
    });    
    container.appendChild(fragment);
// debugger point-events  begin not done yet
    // let i=0;
    // setInterval(()=>{
    //     i = i>=cols ?0 :i;
    //     for(i; i<cols; i++){
    //         for(let j=0;j<rows;j++){
    //             let len = i + cols*j;
    //             if(len+1>elms.length){
    //                 debugger;
    //             }
    //             elms[len++].style.backgroundColor = 'white';
    //             elms[len].style.backgroundColor = '#59B5ED';
    //         }
    //     }
    // },200)
});

