require('express-async-errors')
const express=require("express")
const product=require('./routes/product')
const user=require('./routes/user')
const auth=require('./routes/auth')
const order=require('./routes/order')
const error=require('./middlewares/error')

const app=express()

app.use(express.json());
app.use('/api/products',product);
app.use('/api/users',user);
app.use('/api/auth',auth);
app.use('/api/orders',order);

app.use(error)

module.exports=app