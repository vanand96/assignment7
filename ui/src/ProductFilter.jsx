/* eslint "react/prefer-stateless-function": "off" */

import React from "react";

export default class IssueFilter extends React.Component {
  render() {
    return (
      <div>
        <a href="/#/products">All Issues</a>
        {" | "}
        <a href="/#/products?category=Shirts">Shirts</a>
        {" | "}
        <a href="/#/products?category=Jeans">Jeans</a>
        {" | "}
        <a href="/#/products?category=Jackets">Jackets</a>
        {" | "}
        <a href="/#/products?category=Sweaters">Sweaters</a>
        {" | "}
        <a href="/#/products?category=Accessories">Accessories</a>
        {" | "}
      </div>
    );
  }
}
