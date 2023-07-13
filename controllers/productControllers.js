const Product = require('../models/product')
const ApiFeatures=require('../utils/apiFeatures')


exports.postProduct=async(req,res,next)=>{
    
    // req.body.user=req.user.id;
    const product=new Product(req.body)
    await product.save()

    return res.status(200).send(product)
}

exports.allProducts=async(req,res,next)=>{
    const resultPerPage=5  
    const productCount=await Product.countDocuments() 
    const apiFeatures=new ApiFeatures(Product.find(),req.query)
                                .search()
                                .filter()
                                .pagination(resultPerPage)

    const products=await apiFeatures.query
     return res.status(200).send({
        count:products.length,
        productCount,
        products})
    // return res.status(200).send('hello')
}

exports.getProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

    return res.status(200).send(product)
}

exports.updateProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

    const updatedProduct=await Product.findByIdAndUpdate(req.params.id,
    {$set:req.body},{new:true,})

    return res.status(200).send(updatedProduct)
}

exports.deleteProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

   await product.remove()

    return res.status(200).send('product deleted')
}

exports.reviewProduct=async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user.id,
        name:req.user.username,
        rating:Number(rating),
        comment
    }

    const product=await Product.findById(productId)
    const isReviewed=product.reviews.find(
        rev=>rev.user.toString() === req.user.id.toString()
    )

    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString() === req.user.id.toString()){
                review.comment=comment;
                review.rating=rating;
            }
        })
    }else{
        product.reviews.push(review)
        product.noOfReviews=product.reviews.length
    }

    product.ratings=product.reviews.reduce((acc,review) => review.rating + acc,0) / product.reviews.length

    await product.save();

    return res.status(200).send('reviewed')
}

exports.singleProductReviews=async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    return res.status(200).send({
        reviews:product.reviews
    })
}

exports.deleteReview=async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    // const review=product.reviews.id(req.query.reviewId)
    // review.remove();
    // review.save()

    const reviews=product.reviews.filter(review=>review._id.toString() !== req.query.reviewId.toString())
    const numOfReviews=reviews.length

    const ratings=product.reviews.reduce((acc,review) => review.rating + acc,0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{new:true})

    return res.status(200).send({
        reviews:product.reviews
    })
}