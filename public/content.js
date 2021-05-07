chrome.runtime.onMessage.addListener(run);

function run(request, sender, sendResponse) {
    if(request.message === 'init') {
        createCropOverlay();
    }
    // return true;
}


// when the user adds a new note the first thing they need to do is take a quick snapshot of what it is they want to remember - therefore the first thing that pops up should be the
// overlay screenshot/crop screen so they can take the snapshot
function createCropOverlay() {
    // dont want the screenshot overlay effected by the pages css so using shadow-root to create an part of the page that will contain its own css apart from the native webpage
    const shadowContainer = document.createElement('div');
        shadowContainer.id = 'extension--shadow-container';
        const shadow = shadowContainer.attachShadow({ mode: 'open' });
        const style = document.createElement('style');

        // canvas is used because of its clipping capabilities, essentially what is happening is a canvas element is being created that takes up the entire viewport of the website
        // then the user can draw on the canvas using a rectangle that 'clips' the canvas, thus the area that is clipped becomes the area the user is taking a screenshot of
        const canvas = document.createElement('canvas');
        canvas.id = 'crop-overlay';
        // the invisibleDiv element is created so the user cant click and interact with the webpage below
        const invisibleDiv = document.createElement('div');
        invisibleDiv.id = 'hiddenDiv';

        style.textContent = `
            #crop-overlay {
                z-index: 30000;
                position: absolute;
                top: 0;
                cursor: crosshair;
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
        shadow.appendChild(canvas);
        shadow.appendChild(invisibleDiv);
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
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // redraw the part that shouldnt be cleared -i.e the opaque bg

                ctx.save();
                ctx.beginPath();
                let width = mouseX-lastMouseX;
                let height = mouseY-lastMouseY;
                ctx.rect(lastMouseX,lastMouseY,width,height);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.clip();
                ctx.clearRect(lastMouseX,lastMouseY,width,height);
                ctx.restore();
            }

        })

        // the canvas needs to be redrawn if the user resizes the window, otherwise there will be areas that arent covered fully by the overlay crop
        window.addEventListener('resize', function() {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            ctx.fillStyle = 'RGBA(0,0,0,0.3)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        })
}