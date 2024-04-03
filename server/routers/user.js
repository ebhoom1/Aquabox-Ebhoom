const express = require('express')
const {
    register,
    login,
    validuser,
    logout,
}=require('../controllers/user');
const authenticate = require('../middleware/authenticate');

const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/validuser',authenticate, validuser);
router.get('/logout',authenticate, logout);

module.exports=router;