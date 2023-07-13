const mongoose=require("mongoose")
const passwordComplexity = require("joi-password-complexity");
const joi=require('joi')
const jwt=require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'first name reqired'],
        maxlength:[25,'can not exceed 25 cahracter' ],
    },
    lastName:{
        type:String,
        maxlength:[25,'can not exceed 25 cahracter' ],
    },
    username:{
        type:String,
        required:[true,'username name reqired'],
        maxlength:[25,'can not exceed 25 cahracter' ],
        unique:true
    },
    email:{
        type:String,
        required:[true,'first name reqired'],
        maxlength:[25,'can not exceed 25 cahracter' ],
        unique:true
    },
    password:{
        type:String,
        required:[true,'first name reqired'],
        // select:false,
        maxlength:[1024,'password must greater than 1024 character ']
    },
    role:{
        type:String,
        default:'user'
    },
    // profilePic:[
    //     {
    //         public_id:{
    //             type:String,
    //             required:true,
    //         },
    //         url:{
    //             type:String,
    //             required:true,
    //         }
    //     }
    // ],
    isAdmin:{
        type:Boolean,
        default:false
    },
    // resetPasswordToken:String,
    // resetPasswordExpire:Date
},
{
    timestamps:true
})

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWTPRIVATEKEY,{
        expiresIn:process.env.JWTEXPIRE
    });
    return token;
}

function validateUser(user){
    const schema={
        firstName:joi.string().min(3).max(255),
        lastName:joi.string().min(3).max(255),
        username:joi.string().min(3).max(255),
        email:joi.string().min(3).max(255).email(),
        password:joi.string().min(3).max(255).required(),
    }
    // const {error}=validatePassword(user.password)
    // if(error) res.status(400).send(error.details[0].message)
    return joi.validate(user,schema)
}

function validatePassword(password){
    const complexityOptions = {
        min: 10,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
      };
      
      return passwordComplexity(complexityOptions).validate(password);
}




module.exports.User=mongoose.model('User',userSchema)
module.exports.validate=validateUser
module.exports.validatePassword=validatePassword