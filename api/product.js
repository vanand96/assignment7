const { getDb, getNextSequence } = require("./db.js");

async function list(_, { category }) {
  const db = getDb();
  const filter = {};
  if (category) filter.category = category;
  const products = await db.collection("products").find(filter).toArray();
  return products;
  // return productDB;
}

async function add(_, { product }) {
  // product.id = productDB.length + 1;
  // productDB.push(product);
  // return product;
  const db = getDb();
  product.id = await getNextSequence("products");
  const result = await db.collection("products").insertOne(product);
  const savedProduct = await db
    .collection("products")
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

module.exports = { list, add };
