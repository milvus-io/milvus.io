function getOpacity(i) {
    let opacity = Math.random();
    while(opacity > 0.5) {
        opacity = Math.random();
    }
    return opacity;
}

document.addEventListener('DOMContentLoaded', ()=>{
    let container = document.querySelector('.homeContainer');
    let cloth = document.querySelector('.homeSplashFade');
    let rows = Math.floor(window.screen.height / 42);
    let cols = Math.floor(window.screen.width / 8);
    let fragment = document.createDocumentFragment();
    let parts = Array(rows * cols).fill(1);
    let splash = document.createElement('div');
    let elms = [];
    splash.className = 'splash';
    fragment.appendChild(splash);
    parts.forEach((p, i) => {
        let elm = document.createElement('div');
        elm.className = 's';
        elm.style.borderColor = `#59B5ED`;
        elm.style.opacity = getOpacity();
        elms.push(elm);
        splash.appendChild(elm);
    });
    // debugger point-events  begin not done yet
    
    container.appendChild(fragment);
    // setInterval(()=>{
    //     elms.forEach(item=>{
    //         item.style.backgroundColor = Math.random(0,1)>0.5? '#59B5ED':'white'
    //     });
    // },200)
});

