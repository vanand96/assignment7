const fs = require("fs");
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { Kind } = require("graphql/language");
const { MongoClient } = require("mongodb");

// const url = "mongodb://localhost/issuetracker";

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
const url = process.env.DB_URL;
const port = process.env.API_SERVER_PORT || 3000;
// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;
let aboutMessage = "Inventory Management 1.0";

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList,
  },
  Mutation: {
    setAboutMessage,
    productAdd,
  },
};

const productDB = [];

async function productList() {
  const products = await db.collection("products").find({}).toArray();
  return products;
  // return productDB;
}

async function getNextSequence(name) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false }
    );
  return result.value.current;
}

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

async function productAdd(_, { product }) {
  // product.id = productDB.length + 1;
  // productDB.push(product);
  // return product;
  product.id = await getNextSequence("products");
  const result = await db.collection("products").insertOne(product);
  const savedProduct = await db
    .collection("products")
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log("Connected to MongoDB at", url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();
server.applyMiddleware({ app, path: "/graphql" });

// app.listen(3000, function () {
//   console.log("App started on port 3000");
// });

(async function () {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
})();
