import React from "react";
import ProductTable from "./ProductTable.jsx";
import ProductAdd from "./ProductAdd.jsx";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        productList {
          id name category price image 
        }
      }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
        productAdd(product: $product) {
          id
        }
      }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { product } }),
    });
    this.loadData();
  }

  render() {
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <div>Showing all available products</div>
        <hr />
        <ProductTable products={this.state.products} />
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
