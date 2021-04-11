import React from "react";
import graphQLFetch from "./graphQLFetch.js";

export default class ProductView extends React.Component {
  constructor() {
    super();
    this.state = { product: {} };
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
    return (
      <div>
        <h3>Image</h3>
        {/* <pre>{image}</pre> */}
        <img src={image} width="500" height="600" align="center"></img>
      </div>
    );
  }
}
