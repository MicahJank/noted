/* global chrome */
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState(false);

  const handleMessage = async () => {
    chrome.runtime.sendMessage({ message: "click" }, function(response) {
      setMessage(response.message);
    })
  }
  return (
    <div className="App">
      <button onClick={handleMessage}>Click me for a test</button>
      <h2>{message}</h2>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
