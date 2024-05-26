const express = require('express')
const {
    register,
    login,
    validuser,
    logout,
    sendPasswordLink,
    forgotPassword,
    changePassword,
    getAllUsers,
    editUser,
    deleteUser,
    getAUser,
    changeCurrentPassword,
    getAllDeviceCredentials
  
   
    
}=require('../controllers/user');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');


const router=express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', upload.fields([{ name: 'key', maxCount: 1 }, { name: 'cert', maxCount: 1 }, { name: 'ca', maxCount: 1 }]), register);
router.post('/login',login);
router.get('/validuser',authenticate, validuser);
router.get('/logout',authenticate, logout);
router.post('/sendpasswordlink',sendPasswordLink);
router.get('/forgotpassword/:id/:token',forgotPassword);
router.post('/:id/:token',changePassword);
router.get('/getallusers',getAllUsers);
router.patch('/edituser/:userId',editUser);
router.delete('/deleteuser/:userName',deleteUser);
router.get('/getauser/:userId', getAUser)
router.post('/changePassword/:id/:token', changeCurrentPassword);





module.exports=router;