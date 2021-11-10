import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/reduxStore";
import LocaleProvider from "./utils/localeProvider/LocaleProvider";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

window.BUILD_INFO = process.env.BUILD_TIME + "-" + process.env.BUILD_USERNAME;

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <LocaleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
