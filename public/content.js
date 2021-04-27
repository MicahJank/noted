chrome.runtime.onMessage.addListener(run);
//background-color: RGBA(0,0,0,0.59)
function run(request, sender, sendResponse) {
    if(request.message === 'init') {
        console.log('from content.js');
        let shadowContainer = document.createElement('div');
        shadowContainer.id = 'extension--shadow-container';
        let overlay = document.createElement('div');
        overlay.id = 'crop-overlay';
        let shadow = shadowContainer.attachShadow({ mode: 'open' });
        let style = document.createElement('style');

        style.textContent = `
            div {
                position: absolute;
                top: 0;
                background-color: RGBA(0,0,0,0.59);
                width: 100vw;
                height: 100vh;
                cursor: crosshair;
            }
        `
        shadowContainer.appendChild(shadow);
        shadow.appendChild(style);
        shadow.appendChild(overlay);
        document.body.appendChild(shadowContainer);
    }
    // return true;
}