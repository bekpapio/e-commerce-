const {User}=require('../models/user')
const joi=require('joi')
const bcrypt=require('bcrypt')



exports.authUser=async(req,res,next)=>{
    // const{error}=validateAuth(req.body)
    // if(error) return res.status(400).send(error.details[0].message)

    let user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("invalid email or password")

    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send("invalid email or password")

    const token=user.generateAuthToken()
    return res.header('jwt',token).status(200).send({token})
}


function validateAuth(req){
    const schema={
        email:joi.string().min(3).max(255).email(),
        password:joi.string().min(3).max(255).required(),
    }
    return joi.validate(req,schema)
}
