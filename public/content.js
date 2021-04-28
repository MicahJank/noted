chrome.runtime.onMessage.addListener(run);
//background-color: RGBA(0,0,0,0.59)
function run(request, sender, sendResponse) {
    if(request.message === 'init') {
        console.log('from content.js');
        let shadowContainer = document.createElement('div');
        shadowContainer.id = 'extension--shadow-container';
        let overlay = document.createElement('div');
        overlay.id = 'crop-overlay';
        overlay.className = 'overlay';
        let shadow = shadowContainer.attachShadow({ mode: 'open' });
        let style = document.createElement('style');

        let testContainer = document.createElement('div');
        testContainer.className = 'test';

        style.textContent = `
            .overlay {
                position: absolute;
                top: 0;
                background-color: RGBA(0,0,0);
                width: 100vw;
                height: 100vh;
                cursor: crosshair;
                filter: opacity(0.2);
            }

            .test {
                position: absolute;
                top: 30%;
                left: 30%;
                width: 300px;
                height: 200px;
                filter: opacity(1);
                background-color: #fff;
            }
        `
        shadowContainer.appendChild(shadow);
        shadow.appendChild(style);
        shadow.appendChild(overlay);
        overlay.appendChild(testContainer);
        document.body.appendChild(shadowContainer);
    }
    // return true;
}