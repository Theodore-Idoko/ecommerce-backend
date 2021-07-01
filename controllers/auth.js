const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: 'Email already exists!',
    });
  const user = await new User(req.body);
  await user.save((err, user) => {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      })
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.status(200).json({user});
  });
  
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist. Please signup',
      });
    }
    // check email and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Incorrect password',
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    // persist the as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email,role } = user;
    return res.json({ token, user: { _id, email, name,role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.json({ message: 'Signout successful!' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  let user =
    req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied'
    })
  }
  next()
}