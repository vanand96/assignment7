import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Col,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  ButtonToolbar,
  Button,
} from "react-bootstrap";
import NumInput from "./NumInput.jsx";
import TextInput from "./TextInput.jsx";

import graphQLFetch from "./graphQLFetch.js";

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
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
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation productUpdate($id: Int!, $changes: ProductUpdateInputs!) {
      productUpdate(id:$id, changes:$changes) {
        id name category price
      }
    }`;

    const { id, name, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert("Updated product successfully"); // eslint-disable-line no-alert
    }
  }

  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id category name price image
      }
    }`;

    const {
      match: {
        params: { id },
      },
    } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data ? data.product : {}, invalidFields: {} });
  }

  render() {
    const {
      product: { id },
    } = this.state;
    const {
      match: {
        params: { id: propsId },
      },
    } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting.
        </div>
      );
    }

    const {
      product: { name, category },
    } = this.state;
    const {
      product: { price, image },
    } = this.state;

    return (
      <Panel>
                
        <Panel.Heading>
          <Panel.Title>{`Editing product: ${id}`}</Panel.Title>        
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Category
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="category"
                  value={status}
                  onChange={this.onChange}
                >
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Accessories">Accessories</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup validationState={invalidFields.name ? "error" : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Name
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Price
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Image
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="image"
                  value={image}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">
                    Submit
                  </Button>
                  <LinkContainer to="/products">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
          {validationMessage}
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {" | "}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}
