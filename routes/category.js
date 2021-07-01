const express = require('express');
const router = express.Router();

const {  create, categoryById, read, update, remove, list } = require('../controllers/category')
const { userById } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.get('/categories', list)

// any route containing  : userId, our app will first execute userById()
router.param('userId', userById);

// any route containing  : categoryId, our app will first execute userById()
router.param('categoryId', categoryById)
module.exports = router;