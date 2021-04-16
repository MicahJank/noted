import React from 'react';
import ReactDOM from 'react-dom';
import ReactShadowRoot from 'react-shadow-root';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const injectWrapper = document.body;
const app = document.createElement('div');

app.id = 'noted-chrome-extension';

if(injectWrapper) injectWrapper.prepend(app);

ReactDOM.render(
  <ReactShadowRoot>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactShadowRoot>,
  document.getElementById('noted-chrome-extension')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
