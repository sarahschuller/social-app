const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function connect() {
  await client.connect();
  module.exports = client.db();
  const app = require("./app");
  app.listen(process.env.PORT);
}

connect();
