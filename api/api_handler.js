const fs = require("fs");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");

const about = require("./about.js");
const product = require("./product.js");

const resolvers = {
  Query: {
    about: about.getAboutMessage,
    productList: product.list,
    product: product.get,
    productCounts: product.counts,
  },
  Mutation: {
    setAboutMessage: about.setAboutMessage,
    productAdd: product.add,
    productUpdate: product.update,
    productDelete: product.delete,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  server.applyMiddleware({ app, path: "/graphql" });
}

module.exports = { installHandler };
