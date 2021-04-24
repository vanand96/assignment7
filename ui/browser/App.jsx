/* eslint "react/react-in-jsx-scope": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint "no-alert": "off" */
import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Page from "../src/Page.jsx";

const element = (
  <Router>
    <Page />
  </Router>
);

ReactDOM.hydrate(element, document.getElementById("content"));

if (module.hot) {
  module.hot.accept();
}
