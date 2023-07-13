const express=require('express')
const router=express.Router()
const auth=require('../middlewares/auth')
const isAdmin=require('../middlewares/isAdmin')
const authorizeRoles=require('../middlewares/authRole')

const {createOrder,singleOrder,myOrder,allOrders,updateOrder,deleteOrder} =require("../controllers/orderController")

router.route('/').post(auth,createOrder).get(auth,allOrders)
router.route('/me').get(auth,myOrder)
router.route('/:id').get(auth,singleOrder).put(auth,updateOrder).delete(auth,deleteOrder)


module.exports=router;