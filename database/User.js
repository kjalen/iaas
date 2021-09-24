var mongoose = require('mongoose');
const db = require('./mongo')

var userSchema = mongoose.Schema({
  email: String, //TODO: validation { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  password: String,
  sequence: { start: Number, current: Number, increment: Number },
  access_token: String
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

exports.createUser = (p_user) => {
  db.getDatabase()
  const user = new User(p_user)

  return user.save();
};

exports.listUsers = () => {
  return User.find().then(result => {
    return result
  })
}

exports.getUserByToken = (token) => {
  return User.findOne({ access_token: token })
}

exports.getUserByEmailAndPassword = (email, password) => {
  return User.findOne({ email: email, password: password })
}

exports.getUserByEmail = (email) => {
  return User.findOne({ email: email })
}


exports.retrieveSeqAndIncremement = async (user) => {
  try {
    const doc = await User.findById(user._id);
    const currentVal = doc.sequence.current;
    doc.sequence.current += doc.sequence.increment;
    doc.save();
    return currentVal;

  } catch (err) {
    console.log('err! ' + err);
    return err;
  }
}

exports.retrieveAndModify = async (user, newValue) => {
  try {
    const doc = await User.findById(user._id);
    doc.sequence.current = parseInt(newValue)
    doc.save();
    return newValue;

  } catch (err) {
    console.log('err! ' + err);
    return err;
  }
}
exports.retrieveAndModifyInc = async (user, newValue) => {
  try {
    const doc = await User.findById(user._id);
    doc.sequence.increment = parseInt(newValue)
    doc.save();
    return newValue;

  } catch (err) {
    console.log('err! ' + err);
    return err;
  }
}


exports.userLogin = (user) => {
  const filter = { email: user.email };
  const update = { access_token: user.token }
  return User.findOneAndUpdate(filter, update, {
    new: true
  });

  exports.incrementSeq = (user) => {

  }


}