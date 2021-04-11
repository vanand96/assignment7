import React from "react";
import URLSearchParams from "url-search-params";

import ProductFilter from "./ProductFilter.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductAdd from "./ProductAdd.jsx";
import graphQLFetch from "./graphQLFetch.js";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);

    const vars = {};
    if (params.get("category")) vars.category = params.get("category");

    const query = `query productList($category: ProductType) {
        productList (category: $category) {
          id name category price image 
        }
      }`;

    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({ products: data.productList });
    }
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
        productAdd(product: $product) {
          id
        }
      }`;

    const data = await graphQLFetch(query, { product });
    if (data) {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <ProductFilter />
        <div>Showing all available products</div>
        <hr />
        <ProductTable products={products} />
        <div>
          <br />
          Add a new product to inventory
        </div>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}
