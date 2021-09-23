// ./src/database/ids.js
const { getDatabase } = require('./mongo');
const { ObjectID } = require('mongodb');
const UserModel = require('./User')
const dbHandler = require('./db-handler')
const Bcrypt = require("bcryptjs");




async function getAll() {
  const database = await getDatabase();
  return await UserModel.listUsers()
}

async function findByToken(token) {
  console.log('token is ' + token);

  token = token.replace('Bearer ', '')
  console.log('token is! ' + token);
  return await UserModel.getUserByToken(token)
}

async function findByEmail(email) {
  return await UserModel.getUserByEmail(email)
}

async function retrieveSeqAndIncremement(user) {
  return await UserModel.retrieveSeqAndIncremement(user)
}


async function registerUser(user, token) {
  dbHandler.connect()
  let hashedPass = Bcrypt.hashSync(user.password, 10);
  user.password = hashedPass
  user.access_token = token
  return UserModel.createUser(user)
}

async function loginUser(user, token) {
  dbHandler.connect()
  findByEmail(user.email).then(result => {
    if(!Bcrypt.compareSync(user.password, result.password)){
      return UserModel.userLogin(user)
    }else{
      return false;
    }
  })
}

async function verifyUser(user) {

}
module.exports = {
  registerUser,
  getAll,
  findByToken,
  loginUser,
  retrieveSeqAndIncremement
};