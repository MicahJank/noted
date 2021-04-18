/* global chrome */
import React, { useState } from 'react';

const Top = () => {
    const [message, setMessage] = useState(false);

    const handleMessage = async () => {
        chrome.runtime.sendMessage({ message: "click" }, function(response) {
          setMessage(response.message);
        })
      }
      return (
        <div className="top-container">
          <button onClick={handleMessage}>Click me for a test</button>
          <h2>{message}</h2>
        </div>
      );
}

export default Top;