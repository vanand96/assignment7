import React from "react";
import graphQLFetch from "./graphQLFetch.js";
import Toast from "./Toast.jsx";

export default class ProductView extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
    };
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (prevId !== id) {
      this.loadData();
    }
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

  async loadData() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const query = `query product($id: Int!) {
      product (id: $id) {
        id image
      }
    }`;

    const data = await graphQLFetch(query, { id });
    if (data) {
      this.setState({ product: data.product });
    } else {
      this.setState({ product: {} });
    }
  }

  render() {
    const {
      product: { image },
    } = this.state;
    const { toastVisible, toastType, toastMessage } = this.state;
    return (
      <div>
        <h3>Image</h3>
        <pre>{image}</pre>
        <img src={image} width="500" height="600" align="center"></img>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </div>
    );
  }
}
