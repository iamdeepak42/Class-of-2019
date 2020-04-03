const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('./../utils/sendMail');

const createToken = data => {
    var token = jwt.sign({
        _id: data._id,
        role: data.role,
        name: data.name
    }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE
    })
    return token;
}

const map_user_req = (user, userDetails) => {
    if (userDetails.name)
        user.name = userDetails.name;
    if (userDetails.email)
        user.email = userDetails.email;
    if (userDetails.password)
        user.password = userDetails.password
}

module.exports = {
    postRegister: async (req, res, next) => {
        try {
            const newUser = new UserModel({});
            if (req.body.password === req.body.cpassword) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
                map_user_req(newUser, req.body);
                const activeToken = crypto.randomBytes(10).toString('hex');
                newUser.activeToken = crypto
                    .createHash('sha256')
                    .update(activeToken)
                    .digest('hex');
                await newUser.save();
                const activeURL = `${req.protocol}://${req.get('host')}/activate/${activeToken}`;
                const html = `<h3><a href="${activeURL}">Click here</a> to activate your account</h3>`;
                await sendMail({
                    email: req.body.email,
                    subject: 'activate account',
                    html
                })
                res.render('register', {
                    errMsg:  null,
                    success: 'Email sent to activate your account. Please check your email'
                });
            } else {
                return res.render('register', {
                    errMsg: 'password did not match',
                    success:null
                });
            }
        } catch (err) {
            next(err)
        }
    },
    postLogin: async (req, res, next) => {
        try {
            const user = await UserModel.findOne({
                email: req.body.email
            }).select('+password')
            if (!user) {
                return res.render('login', {
                    errMsg: 'No such user'
                });
            }
            var isMatched = await bcrypt.compare(req.body.password, user.password);
            if (!isMatched) {
                return res.render('login', {
                    errMsg: 'Invalid Password'
                })
            }
            if (user.status === 'inactive') {
                return res.render('login', {
                    errMsg: 'Inactive account'
                })
            }
            var token = createToken(user);
            res.cookie('token', token, {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
                ),
                httpOnly: true
            }).render('form', {
                user
            })
        } catch (err) {
            next(err)
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const user = await UserModel.findOne({
                email: req.body.email
            })
            var resetToken = crypto.randomBytes(10).toString('hex');
            user.resetPasswordToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            user.resetPasswordExpire = Date.now() + 10 * 1000 * 60;
            await user.save();
            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
            const html = `<h3><a href="${resetURL}">Click here</a> to reset your password</h3>`
            await sendMail({
                email: req.body.email,
                subject: 'reset password',
                html
            })
            res.render('forgotPassword', {
                msg: 'Email Sent'
            });
        } catch (err) {
            next(err)
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const resetToken = req.params.resetToken;
            const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const user = await UserModel.findOne({
                resetPasswordToken
            }).select('+password');
            if (!user) {
                return next('no such user');
            }
            const expireTime = new Date(user.resetPasswordExpire).getTime();
            if (expireTime <= Date.now()) {
                next('token expired');
            }
            if (req.body.password === req.body.cpassword) {
                user.password = req.body.password;
                user.resetPasswordExpire = undefined;
                user.resetPasswordToken = undefined;
                await user.save();
                if(user.status=='inactive'){
                    return res.render('login',{
                        errMsg: 'Password reset success but Inactive account'
                    })
                }
                var token = createToken(user);
                res.cookie('token', token, {
                    expires: new Date(
                        Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
                    ),
                    httpOnly: true
                }).render('form', {
                    user
                })
            } else {
                next('password did not match')
            }
        } catch (err) {
            next(err)
        }
    },
    activate:async(req,res,next)=>{
       try{
        const activeToken = req.params.activeToken;
        const hashedToken = crypto.createHash('sha256').update(activeToken).digest('hex');
        const user = await UserModel.findOne({
            activeToken: hashedToken
        }).select('+password');
        user.status='active';
        const saved = await user.save();
        var token = createToken(user);
        res.cookie('token', token, {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
            ),
            httpOnly: true
        }).render('form', {
            user
        })
       }catch(err){
           next(err)
       }

    },
    logout: (req, res, next) => {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        res.redirect('/login');
    }
}