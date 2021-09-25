var mongoose = require('mongoose');
const db = require('./mongo')

var userSchema = mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  password: String,
  sequence: { start: {type: Number, default: 0} , current:{type: Number, default: 0}, increment:{type: Number, default: 1} },
  access_token: String
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

exports.createUser = async (p_user) => {
  db.getDatabase()
  const user = new User(p_user);
  return user.save();
};

exports.logIn = async (user, token) => {
  const doc = await User.findById(user._id);
  doc.access_token = token
  doc.save();
  return doc.access_token;
}

exports.listUsers = () => {
  return User.find().then(result => {
    return result
  })
}

exports.getUserByToken = async (token) => {
  return User.findOne({ access_token: token })
}

exports.getUserByEmailAndPassword = (email, password) => {
  return User.findOne({ email: email, password: password })
}

exports.getUserByEmail = (email) => {
  return User.findOne({ email: email })
}

exports.reset = async (user) => {
  const doc = await User.findById(user._id);
  // set current = start to reset value
  doc.sequence.current = doc.sequence.start
  doc.save((err) => {
    if (err) console.error(err);
  });
  return doc.sequence.toObject()
}

exports.retrieveSeqAndIncrement = async (user) => {
  try {
    // get user object in db
    const doc = await User.findById(user._id);
    // increment current value by adding it to iterator, and save it
    doc.sequence.current += doc.sequence.increment;
    doc.save();
    return doc.sequence
  } catch (err) {
    return err;
  }
}

exports.retrieveAndModify = async (user, newValue) => {
  const doc = await User.findById(user._id);
  doc.sequence.current = parseInt(newValue)
  doc.save((err) => {
    if (err) console.error(err);
  });
  return doc.sequence.toObject();
}

exports.retrieveAndModifyInc = async (user, newValue) => {
  const doc = await User.findById(user._id);
  doc.sequence.increment = parseInt(newValue)
  doc.save((err) => {
    if (err) console.error(err);
  });
  return doc.sequence;
}


