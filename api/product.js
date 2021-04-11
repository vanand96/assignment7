const { getDb, getNextSequence } = require("./db.js");

async function list() {
  const db = getDb();
  const products = await db.collection("products").find({}).toArray();
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
