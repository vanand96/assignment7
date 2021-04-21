import React from "react";
import URLSearchParams from "url-search-params";
import { Route } from "react-router-dom";
import { Panel } from "react-bootstrap";

import ProductFilter from "./ProductFilter.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductAdd from "./ProductAdd.jsx";
import ProductView from "./ProductView.jsx";

import graphQLFetch from "./graphQLFetch.js";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
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

    const priceMin = parseInt(params.get("priceMin"), 10);
    if (!Number.isNaN(priceMin)) vars.priceMin = priceMin;
    const priceMax = parseInt(params.get("priceMax"), 10);
    if (!Number.isNaN(priceMax)) vars.priceMax = priceMax;

    const query = `query productList(
      $category: ProductType
      $priceMin: Int
      $priceMax: Int
      ) {
        productList (
          category: $category
          priceMin: $priceMin
          priceMax: $priceMax
          ) {
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

  async deleteProduct(index) {
    const query = `mutation productDelete($id: Int!) {
      productDelete(id: $id)
    }`;
    const { products } = this.state;
    const {
      location: { pathname, search },
      history,
    } = this.props;
    const { id } = products[index];
    const data = await graphQLFetch(query, { id });
    if (data && data.productDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        if (pathname === `/products/${id}`) {
          history.push({ pathname: "/products", search });
        }
        newList.splice(index, 1);
        return { products: newList };
      });
    } else {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    const { match } = this.props;
    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filters</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ProductFilter />
          </Panel.Body>
        </Panel>
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <div>
          <br />
          Add a new product to inventory
        </div>
        <ProductAdd createProduct={this.createProduct} />
        <Route path={`${match.path}/:id`} component={ProductView} />{" "}
      </React.Fragment>
    );
  }
}
