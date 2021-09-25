const { getDatabase } = require('../database/mongo');
const UserModel = require('../database/User')
const dbHandler = require('../database/db-handler')
const Bcrypt = require("bcryptjs");

/**
 * Returns User model with default values for sequence
 *
 * @param {{email: string, password: string, {start: number, current: number, increment: number}, access_token: String}} user Body of the request to /register, consisting of {email, password}
 * @param {string} token the authorization token from getAuth()
 * @return {UserModel} The newly created user
 */
async function registerUser(user, token) {
  dbHandler.connect()
  let hashedPass = Bcrypt.hashSync(user.password, 10);
  user.password = hashedPass
  user.access_token = token
  const result = await UserModel.createUser(user)
  return result;
}

/**
 * Overwrites the Users access token in the db with a new one, allowing them to continue where they left off
 *
 * @param {{email: string, password: string, {start: number, current: number, increment: number}, access_token: String}} user Body of the request to /register, consisting of {email, password}
 * @param {string} token the authorization token from getAuth(), if login is successful, this is the new token their user schema will use
 * @return {string} The new token if login is successful, otherwise false
 */
async function loginUser(user, newToken) {
  dbHandler.connect()
  const dbUser = await UserModel.getUserByEmail(user.email)
  if (Bcrypt.compareSync(user.password, dbUser.password)) {
    const result = await UserModel.logIn(dbUser, newToken);
    return result;
  }
  return false;
}

/**
 * Returns all user objects currently in memory, useful for debugging, would be behind elevated
 * auth privileges in a real application.
 * @return {userSchema} The entire userschema collections
 */
async function getAll() {
  const database = await getDatabase();
  return await UserModel.listUsers()
}

/**
 * retrieves users record via token, in userSchema.accessToken
 * @param {string} token the authorization token from getAuth()
 * @return {UserModel} The Usermodel attached to the token
 */
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

/**
 * increments users sequence.current value and returns it
 * @param {string} token the authorization token from getAuth()
 * @return {{start: number, current: number, increment: number}} The users sequence  after modifying
 */
async function retrieveSeqAndIncrement(token) {
  const user = await findByToken(token)
  const result = await UserModel.retrieveSeqAndIncrement(user)
  return result
}

/**
 * Sets users sequence.current value to supplied value
 * @param {string} token the authorization token from getAuth()
 * @param {number} newValue The new sequence.current to be saved in the users sequence object
 * @return {{current: number}} The users current sequence number after modifying
 */
async function retrieveSeqAndModify(token, newValue) {
  const user = await findByToken(token);
  return await UserModel.retrieveAndModify(user, newValue);
}

/**
 * Resets Users sequence.cuurent value to start, returns current value
 *
 * @param {string} token the authorization token from getAuth()
 * @return {{current: number}} The users current sequence after resetting
 */
async function resetSeq(token) {
  const user = await findByToken(token)
  const result = await UserModel.reset(user)
  return result.current;
}

/**
 * Modifies Users sequence.increment value and returns sequence object
 *
 * @param {string} token the authorization token from getAuth()
 * @param {number} newValue The new incrementer to be saved in the users sequence object
 * @return {{start: number, current: number, increment: number}} The users modified sequence object
 */
async function retrieveSeqAndModifyInc(token, newValue) {
  const user = await findByToken(token)
  const result = await UserModel.retrieveAndModifyInc(user, newValue)
  return result;
}





module.exports = {
  registerUser,
  getAll,
  findByToken,
  retrieveSeqAndIncrement,
  retrieveSeqAndModify,
  retrieveSeqAndModifyInc,
  resetSeq,
  loginUser
};