
module.exports=function(err,req,res,next){
    err.statusCode=err.statusCode || 500

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).send({
            error:err,
            errmessage:err.message,
            stack:err.stack
        })
    }
    if(process.env.NODE_ENV === 'PRODUCTION'){

        let error={...error}
        err.message=err.message

        res.status(err.statusCode).send({
            errorMessage:err.message || 'internal server error'
        })
    }
    // res.status(500).send('something failed')
}