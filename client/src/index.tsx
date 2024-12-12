import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

  <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_client_id}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter >
  </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
