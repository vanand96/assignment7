const { getDb, getNextSequence } = require("./db.js");

async function get(_, { id }) {
  const db = getDb();
  const product = await db.collection("products").findOne({ id });
  return product;
}

async function list(_, { category, priceMin, priceMax }) {
  const db = getDb();
  const filter = {};
  if (category) filter.category = category;

  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) filter.price.$gte = priceMin;
    if (priceMin !== undefined) filter.price.$lte = priceMax;
  }

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

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.name || changes.price || changes.image) {
    const product = await db.collection("products").findOne({ id });
    Object.assign(product, changes);
  }
  await db.collection("products").updateOne({ id }, { $set: changes });
  const savedProduct = await db.collection("products").findOne({ id });
  return savedProduct;
}

async function remove(_, { id }) {
  const db = getDb();
  const product = await db.collection("products").findOne({ id });
  if (!product) return false;
  product.deleted = new Date();

  let result = await db.collection("deleted_products").insertOne(product);
  if (result.insertedId) {
    result = await db.collection("products").removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = { list, add, get, update, delete: remove };
