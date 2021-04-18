/* global chrome */
import React, { useState } from 'react';
import '../scss/global.scss';

const Top = () => {
    const [message, setMessage] = useState(false);

    const handleMessage = async () => {
        chrome.runtime.sendMessage({ message: "screencapture" }, function(response) {
            console.log(response);
            setMessage(response.message);
        })
      }
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