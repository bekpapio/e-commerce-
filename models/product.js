const mongoose=require('mongoose')

const productSchemas= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxlength:[100,'product cannot exceed 100 character']
    },
    price:{
        type:Number,
        required:[true,'please enter product name'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'please enter product descrition'],
    },
    rating:{
        type:Number,
        default:0
    },
    // image:[
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
    category:{
        type:String,
        enum:['clothes','electronics']
    },
    seller:{
        type:String,
        required:[true,'please enter seller name'],
        trim:true,
        maxlength:[100,'product cannot exceed 100 character']
    },
    stock:{
        type:Number,
        required:true,
        trim:true,
        maxlength:[5,'product cannot exceed 5 character'],
        default:0
    },
    reviewsNum:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                // required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
    },
},
{
    timestamps:true
});

module.exports=mongoose.model('Product',productSchemas);
