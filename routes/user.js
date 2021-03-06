const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();

const { userById, read, update, purchaseHistory } = require('../controllers/user')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req,res) => {
  res.json({
    user: req.profile
  })
})

router.get('/user/:userId',requireSignin, isAuth, read )
router.put('/user/:userId',requireSignin, isAuth, update )
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);

// any route containing  : userId, our app will first execute userById()
router.param('userId', userById);

module.exports = router;
