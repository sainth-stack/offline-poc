import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        const reg = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        console.log("Service Worker Registered:", reg);
      } else {
        console.log("Service Worker Already Registered:", registration);
      }
    } catch (err) {
      console.error("Service Worker Registration Failed:", err);
    }
  });
}
