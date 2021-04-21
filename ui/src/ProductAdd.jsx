import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Button,
} from "react-bootstrap";

export default class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: form.products.value,
      price: form.PricePerUnit.value,
      name: form.ProductName.value,
      image: form.ImageUrl.value,
    };

    this.props.createProduct(product);
    form.products.value = "";
    form.PricePerUnit.value = "$";
    form.ProductName.value = "";
    form.ImageUrl.value = "";
  }

  render() {
    return (
      <Form inline name="productAdd" onSubmit={this.handleSubmit}>
        <label htmlFor="products">Category</label>
        <select name="products" id="products">
          <option value="empty"></option>
          <option value="Shirts">Shirts</option>
          <option value="Accessories">Accessories</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
        </select>
        {/* <label htmlFor="PricePerUnit">Price Per Unit</label> */}
        {/* <input
          type="text"
          name="PricePerUnit"
          id="PricePerUnit"
          defaultValue="$"
        /> */}
                
        <FormGroup>
          <ControlLabel>PricePerUnit:</ControlLabel>                     
          <FormControl type="text" name="PricePerUnit" />         
        </FormGroup>{" "}
        <FormGroup>
          <ControlLabel>Product Name</ControlLabel>                     
          <FormControl type="text" name="ProductName" />         
        </FormGroup>{" "}
        <FormGroup>
          <ControlLabel>Image URL</ControlLabel>                     
          <FormControl type="text" name="ImageUrl" />         
        </FormGroup>{" "}
        {/* <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          name="ProductName"
          id="ProductName"
          placeholder="Enter product name"
        /> */}
        {/* <label htmlFor="ImageUrl">Image URL</label>
        <input
          type="text"
          name="ImageUrl"
          id="ImageUrl"
          placeholder="ImageUrl"
        /> */}
        {/* <input type="submit" onClick={cleardollar} /> */}
        <Button bsStyle="primary" type="submit">
          Add
        </Button>
      </Form>
    );

    function cleardollar() {
      var input = document.getElementById("PricePerUnit");
      input.value = input.value.replace(/\$/g, "");
    }
  }
}
