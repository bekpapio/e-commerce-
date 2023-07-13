const Order=require('../models/order')
const Product=require('../models/product')


exports.createOrder=async(req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body

    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        payedAt:Date.now(),
        user:req.user.id
    })

    return res.status(200).send(order)
}


exports.singleOrder=async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate('user','name email')
    if(!order) return  res.status(404).send(' order not found')
    return res.status(200).send(order)

}

exports.myOrder=async(req,res,next)=>{
    const order=await Order.find({user:req.user.id}).populate('user','name email')
    if(!order) return  res.status(404).send('no orders currently')
    return res.status(200).send(order)

}

exports.allOrders=async(req,res,next)=>{
    const order=await Order.find()
    if(!order) return  res.status(404).send('no orders currently')
    return res.status(200).send(order)

}

exports.updateOrder=async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(order.orderStatus==='delivered') return  res.status(404).send('you have already delivered this item')

    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus=req.body.orderStatus;
    order.deliveredAt=Date.now()
    order.save()
    return res.status(200).send(order)

}

exports.deleteOrder=async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order) return  res.status(404).send(' order not found')

    await order.remove()

    return res.status(200).send("order has successfuly deleted")

}

async function updateStock (id,quantity){
    const product=await Product.findById(id)

    product.stock=product.stock-quantity;
    await product.save()

}