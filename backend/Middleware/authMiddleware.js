const jwt = require('jsonwebtoken');

const UserAuth = async(req,res,next)=>{
    const authHeader = req.header("Authorization");
    if(!authHeader){
        return res.status(400).json({
            status:"failure",
            message:"Authorization header not found"
        })
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(400).json({
            status:"failure",
            message:"Token not found"
        })
    }
    try{
        const decoded = jwt.verify(token,"secret_key");
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(400).json({
            status:"failure",
            message:"Token is invalid"
        })
    }
}

module.exports = UserAuth;