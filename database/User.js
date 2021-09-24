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
  const user = new User(p_user);
  const returnVal = user.access_token;
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

exports.reset = async (user) => {
  const doc = await User.findById(user._id);
  doc.sequence.current = doc.sequence.start
  doc.save((err) => {
    if (err) console.error(err);
  });
  return doc.sequence.toObject()
}

exports.retrieveSeqAndIncremement = async (user) => {
  try {
    // get user object in db
    const doc = await User.findById(user._id);
    // save current user object to variable, to be returned
    const currentVal = doc.sequence.toObject();
    // increment current value by adding it to iterator
    doc.sequence.current += doc.sequence.increment;
    doc.save();
    return currentVal

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
  // need to increment current because the next /next has to take into account the new incrementer
  doc.sequence.current += doc.sequence.increment
  doc.save((err) => {
    if (err) console.error(err);
  });
  return doc.sequence;
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