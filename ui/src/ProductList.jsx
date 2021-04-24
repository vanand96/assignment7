import React from "react";
import URLSearchParams from "url-search-params";
import { Route } from "react-router-dom";
import { Panel } from "react-bootstrap";

import ProductFilter from "./ProductFilter.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductView from "./ProductView.jsx";

import graphQLFetch from "./graphQLFetch.js";
import Toast from "./Toast.jsx";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
    };
    this.deleteProduct = this.deleteProduct.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
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

    const data = await graphQLFetch(query, vars, this.showError);
    if (data) {
      this.setState({ products: data.productList });
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
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.productDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        if (pathname === `/products/${id}`) {
          history.push({ pathname: "/products", search });
        }
        newList.splice(index, 1);
        return { products: newList };
      });
      this.showSuccess(`Deleted product ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: "success",
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: "danger",
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { products } = this.state;
    const { toastVisible, toastType, toastMessage } = this.state;
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
        <Route path={`${match.path}/:id`} component={ProductView} />{" "}
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}
