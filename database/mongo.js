// ./src/database/mongo.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
let database = null;
let connection = null;
let mongoDBURL = null;

async function startDatabase() {
  const mongo = await MongoMemoryServer.create();
  mongoDBURL = mongo.getUri();
  connection = await MongoClient.connect(mongoDBURL, { useNewUrlParser: true });
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

function connect() {
  const mongooseOpts = {
    useNewUrlParser: true,
  };

  mongoose.connect(mongoDBURL, mongooseOpts);
}


module.exports = {
  getDatabase,
  startDatabase,
  connect
};
