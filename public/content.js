chrome.runtime.onMessage.addListener(run);
//background-color: RGBA(0,0,0,0.59)
function run(request, sender, sendResponse) {
    if(request.message === 'init') {
        console.log('from content.js');
        let shadowContainer = document.createElement('div');
        shadowContainer.id = 'extension--shadow-container';
        // let overlay = document.createElement('div');
        // overlay.id = 'crop-overlay';
        // overlay.className = 'overlay';
        let shadow = shadowContainer.attachShadow({ mode: 'open' });
        let style = document.createElement('style');

        // let testContainer = document.createElement('div');
        // testContainer.className = 'test';

        let canvas = document.createElement('canvas');
        canvas.id = 'crop-overlay';
        const invisibleDiv = document.createElement('div');
        invisibleDiv.id = 'hiddenDiv';
        // canvas.width = '1000';
        // canvas.height = '1000';

        // let overlayCrop = document.createElement('div');
        // overlayCrop.id = 'overlay-crop';

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

            #crop-overlay {
                z-index: 30000;
                position: absolute;
                top: 0;
                cursor: crosshair;
            }

            #overlay-crop {
                width: 100%;
                height: 500px;

            }

            #hiddenDiv {
                z-index: 2000
                width: 100vw;
                height: 100vh;
                position: absolute;
                top: 0;
            }
        `
        shadowContainer.appendChild(shadow);
        shadow.appendChild(style);
        // shadow.appendChild(overlay);
        // overlay.appendChild(testContainer);
        shadow.appendChild(canvas);
        shadow.appendChild(invisibleDiv);
        // shadow.appendChild(overlayCrop);
        document.body.appendChild(shadowContainer);

        const ctx = canvas.getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        let canvasX = $(canvas).offset().left;
        let canvasY = $(canvas).offset().top;
        let lastMouseX = lastMouseY = 0;
        let mouseX = mouseY = 0;
        let mouseDown = false;
        
        ctx.fillStyle = 'RGBA(0,0,0,0.3)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        $(canvas).on('mousedown', function(e) {
            lastMouseX = parseInt(e.clientX-canvasX);
            lastMouseY = parseInt(e.clientY-canvasY);
            mouseDown = true;
        });

        $(canvas).on('mouseup', function(e) {
            mouseDown = false;
        });

        $(canvas).on('mousemove', function(e) {
            mouseX = parseInt(e.clientX-canvasX);
            mouseY = parseInt(e.clientY-canvasY);

            if(mouseDown) {
                ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
                ctx.fillStyle = 'RGBA(0,0,0,0.3)';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // redraw the part that shouldnt be cleared

                ctx.save();
                ctx.beginPath();
                let width = mouseX-lastMouseX;
                let height = mouseY-lastMouseY;
                // ctx.fillStyle = 'white';
                // ctx.fillRect(lastMouseX,lastMouseY,width,height);
                ctx.rect(lastMouseX,lastMouseY,width,height);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.clip();
                ctx.clearRect(lastMouseX,lastMouseY,width,height);
                ctx.restore();
            }

        })

        window.addEventListener('resize', function() {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        })
    }
    // return true;
}