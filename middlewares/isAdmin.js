
function isAdmin(req,res,next){
    if(!req.user.isAdmin) return res.status(403).send('acces denied')
    next()
}

module.exports=isAdmin;