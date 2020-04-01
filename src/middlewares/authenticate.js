const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
module.exports = async(req,res,next)=>{
    let token;
    if(req.cookies.token){
        token = req.cookies.token
    }
    if(token){
        try{
            const decoded = await jwt.verify(token,process.env.SECRET_KEY);
            const user = await UserModel.findById(decoded._id);
            req.loggedInUser = user;
            next();
        }catch(err){
            next(err)
        }
    }else{
        return res.redirect('/login');
    }
}