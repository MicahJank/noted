chrome.runtime.onMessage.addListener(run);

function run(request, sender, sendResponse) {
    if(request.message === 'init') {
        createCropOverlay();
    } else if (request.message === 'crop') {
        // console.log(request);
        createNote(request.image, request.cropOptions);
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

        $(canvas).on('mouseup', async function(e) {
            console.log('Mouse Up!');
            console.log("cropStartX: ", lastMouseX);
            console.log("cropStartY: ", lastMouseY);
            console.log("cropEndX: ", mouseX);
            console.log("cropEndY: ", mouseY);
            let width = mouseX-lastMouseX;
            let height = mouseY-lastMouseY;
            mouseDown = false;

            // on the mouse up the details for the image should be sent to the background.js so it can take a snapshot of the window and then send all the details back to be cropped
            chrome.runtime.sendMessage({ message: "createScreenshot", properties: { cropX: lastMouseX, cropY: lastMouseY, width: width, height: height } })
            
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

// the area the user selected with their mouse in createCropOverlay is used to crop the image that the background.js screenshot captured and sent back here to the content.js
// createNote actually does the work of cropping the image and creating the modal for the user to enter their information in
function createNote(image, cropOptions) {
    const shadowContainer = document.createElement('div');
    shadowContainer.id = 'extension--note-modal';
    const shadow = shadowContainer.attachShadow({ mode: 'open' });
    const style = document.createElement('style');

    const canvas = document.createElement('canvas');
    canvas.width = cropOptions.width;
    canvas.height = cropOptions.height;
    canvas.id = 'cropped-image';

    const modal = document.createElement('div');
    modal.id = 'noteModal-container';
    const noteForm = document.createElement('form');
    noteForm.id = 'form-note';
    modal.appendChild(noteForm);
    
    const top = document.createElement('div');
    top.id = 'top-area';
    const title = document.createElement('input');
    title.id = 'note-title';
    noteForm.appendChild(top);
    top.appendChild(title);
    
    const middle = document.createElement('div');
    middle.id = 'middle-area';
    const imageContainer = document.createElement('div');
    imageContainer.id = 'image-container';
    const notes = document.createElement('textarea');
    notes.id = 'notes-area';
    noteForm.appendChild(middle);
    middle.appendChild(imageContainer);
    imageContainer.appendChild(canvas);
    middle.appendChild(notes);
    
    const bottom = document.createElement('div');
    bottom.id = 'bottom-area';
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel';
    const saveNote = document.createElement('button');
    saveNote.id = 'save-note';
    noteForm.appendChild(bottom);
    bottom.appendChild(cancelButton);
    bottom.appendChild(saveNote);


    style.textContent = `
            #cropped-image {
                z-index: 30000;
                position: absolute;
                top: 0;
            }

            #noteModal-container {
                position: absolute;
                z-index: 30000;
                top: 0;
                width: 70%;
            }

            #form-note {
                display: flex;
                flex-direction: column;
                width: 90%;
                
            }
    `;

    shadowContainer.appendChild(shadow);
    shadow.appendChild(style);
    document.body.appendChild(shadowContainer);
    shadow.appendChild(modal);
    // shadow.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const htmlImg = document.createElement('img');
    htmlImg.id = 'screenshot';
    htmlImg.src = image;
    console.log(htmlImg);
    drawImg(ctx, image, cropOptions)

    // after cropping the image and after the user enters in the information for the note they want saved, all that info should be sent to the background script to process and send
    // to the server as well as to the react app to display
    chrome.runtime.sendMessage({ message: "saveNote" })

}


function drawImg(ctx, data, options) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, options.cropX, options.cropY, options.width, options.height, 0, 0, options.width, options.height);
    }
    img.src = data;
}