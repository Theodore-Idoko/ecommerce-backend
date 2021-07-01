const express = require('express');
const router = express.Router();

const {  create, productById, read, remove, update,list } = require('../controllers/product')
const { userById } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)
router.get('/products', list);

// any route containing  : userId, our app will first execute userById()
router.param('userId', userById);

// any route containing  : productId, our app will first execute productById()
router.param('productId', productById);
module.exports = router;