const jwt=require('jsonwebtoken');
const { User } = require('../models/user');

module.exports=async function(req,res,next){
    const token=req.header('jwt');
    if(!token) return res.status(401).send('access denied.no token provide. please login')
    try{
        const decode=jwt.verify(token,process.env.JWTPRIVATEKEY)
        req.user=await User.findById(decode.id)
        next()
    }catch(err){
        res.status(400).send('invalid token')
    }
   
}
