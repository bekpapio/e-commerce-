const app=require('./app')
const connectDb=require("./config/db")

const dotenv=require('dotenv')
dotenv.config({path:'config/config.env'})

connectDb()
if(!process.env.JWTPRIVATEKEY){
    console.log('Fatal error: JWTPRIVATEKEY does not exist')
    process.exit(1)
}

process.on('uncaughtException',(ex)=>{
    console.log('we got uncaught exception',ex)
    process.exit(1)
})


const port=process.env.PORT|| 3000;
app.listen(port,()=>{
    console.log(`server started on port: ${port}`)
})



process.on('unhandleRejection',(ex)=>{
    console.log('we got unhandleRejection',ex)
    process.exit(1)
})

