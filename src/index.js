import React from "react";
import ReactDOM from "react-dom";
// import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import './custom.scss';
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth0Provider";

ReactDOM.render(
    <BrowserRouter>
    <Auth0ProviderWithHistory>
      <App />
      </Auth0ProviderWithHistory>
    </BrowserRouter>,
  document.getElementById("root")
);
