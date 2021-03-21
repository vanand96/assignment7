const fs = require("fs");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

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

function productList() {
  return productDB;
}

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

function productAdd(_, { product }) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
  resolvers,
});

const app = express();
app.use(express.static("public"));
server.applyMiddleware({ app, path: "/graphql" });

app.listen(3000, function () {
  console.log("App started on port 3000");
});
