const { getDatabase } = require('../database/mongo');
const UserModel = require('../database/User')
const dbHandler = require('../database/db-handler')
const Bcrypt = require("bcryptjs");



// mainly for debugging, gets all user objects currently in db
async function getAll() {
  const database = await getDatabase();
  return await UserModel.listUsers()
}

async function findByToken(token) {
  token = token.replace('Bearer ', '')
  try {
    const user = await UserModel.getUserByToken(token)
    return user;
  }
  catch (err) {
    return ('err! ' + err)
  }
}

async function retrieveSeqAndIncremement(token) {
  const user = await findByToken(token)
  const result = await UserModel.retrieveSeqAndIncremement(user)
  console.log(result);
  return result
}


async function retrieveSeqAndModify(token, newValue) {
  const user = await findByToken(token)
  const result = await UserModel.retrieveAndModify(user, newValue)
  return result;
}

async function resetSeq(token) {
  const user = await findByToken(token)
  const result = await UserModel.reset(user)
  return result.current;
}

async function retrieveSeqAndModifyInc(token, newValue) {
  const user = await findByToken(token)
  const result = await UserModel.retrieveAndModifyInc(user, newValue)
  return result;
}


async function registerUser(user, token) {
  dbHandler.connect()
  let hashedPass = Bcrypt.hashSync(user.password, 10);
  user.password = hashedPass
  user.access_token = token
  const result = await UserModel.createUser(user)
  return result;
}

module.exports = {
  registerUser,
  getAll,
  findByToken,
  retrieveSeqAndIncremement,
  retrieveSeqAndModify,
  retrieveSeqAndModifyInc,
  resetSeq
};