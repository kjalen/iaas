var mongoose = require('mongoose');
const db = require('./mongo')

var userSchema = mongoose.Schema({
  email: String,
  hash: String,
  salt: String,
  access_token: String
}, {timestamps: true});

const User = mongoose.model('Users', userSchema);

exports.createUser = (p_user) => {
  db.getDatabase()
  const user = new User(p_user);
  return user.save();
};

exports.listUsers = () => {
  return User.find().then(result => {
    return result
  })
}

exports.getUserByToken = (token) => {
  return User.findOne({access_token: token})
}