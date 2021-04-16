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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({ message : Math.floor(Math.random() * 10 + 1) });
        return true;
    }
);