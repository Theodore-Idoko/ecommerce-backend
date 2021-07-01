const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();

const { userById } = require('../controllers/user')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req,res) => {
  res.json({
    user: req.profile
  })
})

// any route containing  : userId, our app will first execute userById()
router.param('userId', userById);

module.exports = router;
