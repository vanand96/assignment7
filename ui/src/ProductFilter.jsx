/* eslint "react/prefer-stateless-function": "off" */

import React from "react";
import { Link } from "react-router-dom";

export default class ProductFilter extends React.Component {
  render() {
    return (
      <div>
        <Link to="/products">All Products</Link>
        {" | "}
        <Link to={{ pathname: "/products", search: "?category=Shirts" }}>
          Shirts
        </Link>
        {" | "}
        <Link to={{ pathname: "/products", search: "?category=Jeans" }}>
          Jeans
        </Link>
        {" | "}
        <Link to={{ pathname: "/products", search: "?category=Jackets" }}>
          Jackets
        </Link>
        {" | "}
        <Link to={{ pathname: "/products", search: "?category=Sweaters" }}>
          Sweaters
        </Link>
        {" | "}
        <Link to={{ pathname: "/products", search: "?category=Accessories" }}>
          Accessories
        </Link>
      </div>
    );
  }
}
