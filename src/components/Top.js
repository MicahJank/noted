/* global chrome */
import React, { useState } from 'react';

const Top = () => {
    // chrome.runtime.onMessage.addListener(test);
    const [message, setMessage] = useState(false);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(request);
      if(request.message === "note") {
       convertImg(request.imageBase64)
       .then(res => {
         console.log(res);
       })
        // getS3SignUrl(request.imgFile.name, request.imgFile.type)
        // .then(res => {
        //   console.log(res);
        // })
        // .catch(err => {
        //   console.log(err);
        // })
        
      }
    })

    async function getS3SignUrl(filename, filetype) {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({ filename, filetype })
      };
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes/presignedUrl`, options)
      const presignedUrl = await response.json();
      return presignedUrl
    }

    async function convertImg(base64Img) {
      const img = await fetch(base64Img)
      const imgBlob = await img.blob()
      const imgFile = new File([imgBlob], "userImage", { type: "image/*" });
       return imgFile
    }

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