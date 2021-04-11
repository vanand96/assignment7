import React from "react";

export default function ProductView({ match }) {
  const { id } = match.params;
  return <h2>{`This is a placeholder for viewing the product ${id}`}</h2>;
}
