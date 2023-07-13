const mongoose=require("mongoose")

mongoose.set('strictQuery',false);
const connectDb=()=>{
    mongoose.connect(process.env.DB_LOCAL_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(con => {
        console.log(`connected to mongodb: ${con.connection.host}`);
    })
    .catch(err=> console.log("couldn't connect to mongodb database ",err));
}

module.exports=connectDb