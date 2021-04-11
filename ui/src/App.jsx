/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint "no-alert": "off" */

import ProductList from "./ProductList.jsx";

const element = <ProductList />;

ReactDOM.render(element, document.getElementById("content"));
