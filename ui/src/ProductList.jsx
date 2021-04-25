import React from "react";
import URLSearchParams from "url-search-params";
import { Panel } from "react-bootstrap";

import ProductFilter from "./ProductFilter.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductView from "./ProductView.jsx";

import graphQLFetch from "./graphQLFetch.js";
import Toast from "./Toast.jsx";
import store from "./store.js";

export default class ProductList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get("category")) vars.category = params.get("category");

    const priceMin = parseInt(params.get("priceMin"), 10);
    if (!Number.isNaN(priceMin)) vars.priceMin = priceMin;
    const priceMax = parseInt(params.get("priceMax"), 10);
    if (!Number.isNaN(priceMax)) vars.priceMax = priceMax;

    const {
      params: { id },
    } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    const query = `query productList(
      $category: ProductType
      $priceMin: Int
      $priceMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      ) {
        productList (
          category: $category 
          priceMin: $priceMin 
          priceMax: $priceMax
          ) {
          id name category price image 
        }
        product(id: $selectedId) @include (if : $hasSelection) {
          id name category price image
        }
      }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const products = store.initialData ? store.initialData.productList : null;
    const selectedProduct = store.initialData
      ? store.initialData.product
      : null;
    delete store.initialData;
    this.state = {
      products,
      selectedProduct,
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
    const { products } = this.state;
    if (products == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      location: { search },
      match: {
        params: { id },
      },
    } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: { search },
      match,
    } = this.props;
    const data = await ProductList.fetchData(match, search, this.showError);
    if (data) {
      this.setState({
        products: data.productList,
        selectedProduct: data.product,
      });
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
    if (products == null) return null;

    const { toastVisible, toastType, toastMessage } = this.state;
    const { selectedProduct } = this.state;
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
        <ProductView product={selectedProduct} />
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
