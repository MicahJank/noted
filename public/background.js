let active = false; // state of the extension -- starts off
let reactManifest = "asset-manifest.json"; // helps with how react compiles the code?

let readTextFile = (file, callback) => {
    // file has to be in the root (/public)
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let disable = (tab) => {
    let code = `document.querySelector('#noted-chrome-extension').remove()`;

	chrome.tabs.executeScript(tab.id, {code: code});
    chrome.browserAction.setBadgeText({text: '', tabId: tab.id});
}

let enable = (tab) => {
    // get the REACT manifest
    readTextFile(reactManifest, function(text) {
        let data = JSON.parse(text);
        let keys = Object.keys(data.files);
        let js = [data.files['main.js'],data.files[keys[3]],data.files[keys[5]]];
    	
    	// inject all the JS files required
    	js.forEach(file => {
    	    chrome.tabs.executeScript(tab.id, {
    		    file: file
        	});
        })
        // inject styles
    	chrome.tabs.insertCSS(tab.id, {
        	file: data.files['main.css']
    	});
    	
    	// badge
        chrome.browserAction.setBadgeText({text: 'ON', tabId: tab.id});
        chrome.browserAction.setBadgeBackgroundColor({color: 'crimson'});
	});
}

// extension clicked on/off
chrome.browserAction.onClicked.addListener((tab) => {
    (active) ? disable(tab) : enable(tab);
    active = !active;
});

// the extension needs to listen out for any incoming message request from the content script as well as the react app
// in some cases the react app will send a message to the background script and the background script will send a message to the content script as a result
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.message) {
        case 'screencapture':
            // sendResponse({ message: 'capture the screen' });
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => { 
                const activeTab = tabs[0];
                // the 'screencapture' message essentially tells the extension to capture the current screen, then we send the formatted image result back to the react app to process
                chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }, image => {
                    console.log(image);
                    sendResponse({ message: image });
                })
            })
            break;
        case 'initialize':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { message: 'init' });
            })
            break;
        
        case 'createScreenshot':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const activeTab = tabs[0];
                chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }, image => {
                    // sendResponse({ message: image });
                    chrome.tabs.sendMessage(activeTab.id, { message: 'crop', image, cropOptions: request.properties });
                })
                
            })
            break;

        default:
            sendResponse({ error: 'Request message is not valid',  requestMessage: request.message });
    }
    return true;
});