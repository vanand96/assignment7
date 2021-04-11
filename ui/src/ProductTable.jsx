import React from "react";

function ProductRow(props) {
  const product = props.Product;
  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.category}</td>
      <td>{product.price}</td>
      <td>{product.name}</td>
      <td>
        <a href={product.image} target="_blank">
          View
        </a>
      </td>
      <td>
        <a href={`/#/edit/${product.id}`}>Edit</a>
      </td>
    </tr>
  );
}

export default function ProductTable(props) {
  const productRows = props.products.map((Product) => (
    <ProductRow key={Product.id} Product={Product} />
  ));

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Price</th>
          <th>Product Name</th>
          <th>Image URL</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{productRows}</tbody>
    </table>
  );
}
