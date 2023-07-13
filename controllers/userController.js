const {User,validate}=require('../models/user')
const _=require('lodash')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')
const Token=require('../models/token')

exports.registerUser=async(req,res,next)=>{
    // const{error}=validate(req.body)
    // if(error) return res.status(400).send(error.details[0].message)

    const user=await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("user alrady exist")

    const salt=await bcrypt.genSalt(10);
    req.body.password=await bcrypt.hash(req.body.password,salt)


    const newUser=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })

    await newUser.save()

    return res.status(200).send(_.pick(newUser,['_id','firstName','username','email']))

}


exports.userProfile=async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('-password')
    return res.status(200).send(user)
}

exports.updateProfile=async(req,res,next)=>{

    const user=await User.findByIdAndUpdate(req.user.id,req.body,{
        new:true
    })

    return res.status(200).send(user)
}

exports.allUsers=async(req,res,next)=>{

    const user=await User.find()
    
    return res.status(200).send(user)
}

exports.singleUser=async(req,res,next)=>{

    const user=await User.findById(req.params.id)

    if(!user) return res.status(400).send("user not found")
    
    return res.status(200).send(user)
}

exports.deleteUser=async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if(!user){
        return res.status(404).send('user not found')
    }

   await user.remove()

    return res.status(200).send('user deleted')
}


exports.updateUser=async(req,res,next)=>{

    const user=await User.findByIdAndUpdate(req.params.id,
        {
        $set:req.body,
        },{
        new:true
        }
    )

    return res.status(200).send(user)
}

exports.updatePassword=async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password')

    const validPassword=await bcrypt.compare(req.body.oldPassword,user.password)
    if(!validPassword) return res.status(400).send("old password is not correct")

    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(req.body.newPassword,salt)

    await user.save()
    return res.status(200).send(_.pick(user,['_id','firstName','username','email']))
}

exports.forgetPassword=async(req,res,next)=>{
    const {email} = req.body
    const user=await User.findOne({email})
    if(!user){
        return res.status(404).send('user not found')
    }

    let token=await Token.findOne({userId:user._id})
    if(token){
        await token.deleteOne()
    }

    let resetToken=crypto.randomBytes(32).toString('hex') + user._id

    const hashedToken=crypto.createHash("sha256").update(resetToken).digest('hex')

    await new Token({
        userId:user._id,
        token:hashedToken,
        expiresAt:Date.now() + 30 *(60*1000)
    }).save()

    console.log(resetToken)

    // const resetUrl=`${process.env.FRONTEND_URL}/resetPassword/${resetToken}`
    // const message=`
    //     <h2>Hello ${user.username}</h2>
    //     <p>please click the url below to reset ur pasword</p>
    //     <p>this link valid for only 30 minutes</p>

    //     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    //     <p>Regards...</p>
    //     <p>papio Team</p>
    // `;
    // const subject='password reset request';
    // const send_to=user.email;
    // const send_from=process.env.EMAIL_USER;

    // try{
    //     await sendEmail(subject,message,send_to,send_from)
    //     return res.status(200).send('reset email sent')
    // }catch(err){
    //     return res.status(500).send('reset email not sent',err)
    // }
}

exports.resetPassword=async(req,res,next)=>{
    const {password}=req.body;
    const {resetToken}=req.params;

    const hashedToken=crypto.createHash("sha256").update(resetToken).digest('hex')

    const userToken=await Token.findOne({
        token:hashedToken,
        expiresAt:{$gt:Date.now()}
        
    })

    if (!userToken){
        return res.status(404).send('invalid or expired token')
    }

    const user=await User.findOne({_id:userToken.userId})

    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt)

    await user.save()
    return res.status(200).send('password successfuly changed')
}
