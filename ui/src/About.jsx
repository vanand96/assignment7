import React from "react";
import store from "./store.js";
export default function About() {
  return (
    <div className="text-center">
      <h3>Inventory Management</h3>
      <h4>{store.initialData ? store.initialData.about : "unknown"}</h4>
    </div>
  );
}
