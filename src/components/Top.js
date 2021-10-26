/* global chrome */
import React, { useState } from 'react';

const Top = () => {
    // chrome.runtime.onMessage.addListener(test);
    const [message, setMessage] = useState(false);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(request);
      if(request.message === "note") {
        fetch("http://localhost:5000/api/notes/presignedUrl")
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err));
      }
    })

    const handleMessage = async () => {
        chrome.runtime.sendMessage({ message: "initialize" }, function(response) {
            console.log(response);
            // setMessage(response.message);
        })

        // let test = await chrome.runtime.sendMessage({ message: "screencapture" })
        // console.log(test);
      }

    // const test = (request, sender, sendResponse) => {
    //     if(request.message === 'test') {
    //         console.log('test in progress');
    //     }
    // }
      return (
        <>
        <div className="top-container">
          <button onClick={handleMessage}>Click me for a test</button>
        </div>
        <div className="image-container">
            <h3 id="test-img">Image</h3>
          {message ? <img className="screenshot" src={message} /> : <p>No image yet</p> }

        </div>
        </>
      );
}

export default Top;