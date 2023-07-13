const express=require('express');
const auth=require('../middlewares/auth')
const authRole=require('../middlewares/authRole')
const router=express.Router();

const {registerUser,userProfile,updatePassword,updateProfile,allUsers,singleUser,deleteUser,updateUser,forgetPassword,resetPassword}=require('../controllers/userController')

router.route('/').post(registerUser).get(auth,authRole('user'),allUsers);
router.route('/me').get(auth,userProfile).put(auth,updateProfile);
router.route('/password').put(auth,updatePassword);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:resetToken').put(resetPassword);
router.route('/:id').delete(auth,deleteUser).get(auth,singleUser).put(auth,updateUser);



module.exports=router;