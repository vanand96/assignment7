/* eslint "react/prefer-stateless-function": "off" */

import React from "react";
import { withRouter } from "react-router-dom";
import URLSearchParams from "url-search-params";

class ProductFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      category: params.get("category") || "",
      changed: false,
    };

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({ category: e.target.value, changed: true });
  }

  showOriginalFilter() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      category: params.get("category") || "",
      changed: false,
    });
  }

  applyFilter() {
    const { category } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/products",
      search: category ? `?category=${category}` : "",
    });
  }

  render() {
    const { category, changed } = this.state;
    return (
      <div>
        Products:{" "}
        <select value={category} onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
        </select>{" "}
        <button type="button" onClick={this.applyFilter}>
          Apply
        </button>{" "}
        <button
          type="button"
          onClick={this.showOriginalFilter}
          disabled={!changed}
        >
          Reset
        </button>
      </div>
    );
  }
}

export default withRouter(ProductFilter);
