// ./src/database/ids.js
const { getDatabase } = require('./mongo');
const { ObjectID } = require('mongodb');
const UserModel = require('./User')
const dbHandler = require('./db-handler')




async function getAll() {
  const database = await getDatabase();
  return await UserModel.listUsers()
}

async function findByToken(token) {
  return await UserModel.getUserByToken(token)
}


async function registerUser(user, token) {
  dbHandler.connect()
  user.access_token = token
  return UserModel.createUser(user)
}
module.exports = {
  registerUser,
  getAll,
  findByToken
};