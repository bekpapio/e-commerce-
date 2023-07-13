const express=require('express')
const router=express.Router()
const auth=require('../middlewares/auth')
const isAdmin=require('../middlewares/isAdmin')
const authorizeRoles=require('../middlewares/authRole')

const{postProduct,allProducts,getProduct,
    updateProduct,deleteProduct,reviewProduct,singleProductReviews,deleteReview}=require('../controllers/productControllers')

router.route('/').get(auth,allProducts).post(auth,postProduct);
router.route('/reviews').put(auth,reviewProduct).get(auth,singleProductReviews).delete(auth,deleteReview)
router.route('/:id').get(auth,getProduct).put(auth,updateProduct).delete(auth,deleteProduct);

module.exports=router;