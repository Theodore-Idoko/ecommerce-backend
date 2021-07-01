const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: 32
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,

  about: {
    type: String,
    trim: true,
  },
  role: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: []
  }, 
  
},{ timestamps: true})

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * keep in mind: virtual properties (password ) don't get persisted in the database.
 * They only exist logically and are not written to the document's collection
 */

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);