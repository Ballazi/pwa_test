import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './components/masterData/Language Change/i18n.jsx';
import { Provider } from 'react-redux';
import store from './redux/store/store.js';
const environment = import.meta.env.VITE_REACT_APP_ENVIRONMENT;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

if (environment !== 'development') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
