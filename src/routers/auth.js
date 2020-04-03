const Router = require('express').Router()
const { postRegister,postLogin,forgotPassword,resetPassword,activate,logout } = require('../controller/auth');

Router.post('/register',postRegister);

Router.post('/login',postLogin);

Router.post('/forgot-password',forgotPassword);

Router.post('/reset-password/:resetToken',resetPassword)

Router.get('/reset-password/:resetToken',(req,res,next)=>{
    res.render('resetPassword',{
        resetToken: req.params.resetToken
    })
})

Router.get('/activate/:activeToken',activate);

Router.get('/logout',logout);

module.exports = Router;