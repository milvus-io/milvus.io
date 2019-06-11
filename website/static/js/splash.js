function getOpacity(i) {
    let opacity = Math.random();
    while(opacity > 0.5) {
        opacity = Math.random();
    }
    return opacity;
}

document.addEventListener('DOMContentLoaded', ()=>{
    let container = document.querySelector('.homeContainer');
    let rows = Math.floor(window.screen.height / 42);
    let cols = Math.floor(window.screen.width / 8);
    let fragment = document.createDocumentFragment();
    let parts = Array(rows * cols).fill(1);
    let splash = document.createElement('div');
    splash.className = 'splash';
    fragment.appendChild(splash);
    parts.forEach((p, i) => {
        let elm = document.createElement('div');
        elm.className = 's';
        elm.style.borderColor = `#59B5ED`;
        elm.style.opacity = getOpacity();
        splash.appendChild(elm);
    });

    container.appendChild(fragment);
});