/* eslint "react/prefer-stateless-function": "off" */

import React from "react";
import { withRouter } from "react-router-dom";

class ProductFilter extends React.Component {
  constructor() {
    super();
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }

  onChangeStatus(e) {
    const category = e.target.value;
    const { history } = this.props;
    history.push({
      pathname: "/products",
      search: category ? `?category=${category}` : "",
    });
  }

  render() {
    return (
      <div>
        Products:{" "}
        <select onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
    );
  }
}

export default withRouter(ProductFilter);
