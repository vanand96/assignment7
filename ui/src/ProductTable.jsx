import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";

const ProductRow = withRouter(
  ({ product, location: { search }, deleteProduct, index }) => {
    const selectLocation = { pathname: `/products/${product.id}`, search };
    return (
      <tr>
        <td>{product.id}</td>
        <td>{product.category}</td>
        <td>{product.name}</td>
        <td>{product.price}</td>
        <td>
          <Link to={`/view/${product.id}`}>View</Link>
          {" | "}
          <Link to={`/edit/${product.id}`}>Edit</Link>
          {" | "}
          <button
            type="button"
            onClick={() => {
              deleteProduct(index);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
);

export default function ProductTable({ products, deleteProduct }) {
  const productRows = products.map((product, index) => (
    <ProductRow
      key={product.id}
      product={product}
      deleteProduct={deleteProduct}
      index={index}
    />
  ));

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Name</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{productRows}</tbody>
    </table>
  );
}
