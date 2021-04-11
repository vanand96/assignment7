/* eslint "react/react-in-jsx-scope": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint "no-alert": "off" */
import "babel-polyfill";
import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";
import ProductList from "./ProductList.jsx";

const element = <ProductList />;

ReactDOM.render(element, document.getElementById("content"));

if (module.hot) {
  module.hot.accept();
}
