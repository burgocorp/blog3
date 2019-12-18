const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const passport = require('passport');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');



// @route POST http://localhost:3000/user/register
// @desc user Register
// @access Public
//user register 1.이메일 유무체크 2.아바타 생성 3. usermodel 4.password 암호화 5. response

router.post('/register', (req,res) => {

    const {errors, isValid} = validateRegisterInput(req.body);
    if (!isValid){
        return res.status(400).json(errors);
    }

    userModel
        .findOne({email : req.body.email})
        .exec()
        .then(user => {
            if (user){
                return res.json({
                    msg : "등록된 메일이 있습니다"
                });
            } else {

                const avatar = gravatar.url(req.body.email,{
                    s:'200', //size
                    r:'pg', //Rating
                    d: 'mm' //Default
                });

                const user = new userModel({
                    name : req.body.username,
                    email : req.body.email,
                    password : req.body.password,
                    avatar : avatar
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if(err) throw err;
                        user.password = hash;
                        user
                        .save()
                        .then(result => {
                            res.json({
                                msg : "registered user",
                                userInfo : result
                            });
                        })
                        .catch(err => {
                            res.json({
                                msg : err.message
                            });
                        });
                    })
                })
            }
        })
        .catch(err => {
            res.json({
                msg : err.message
            });
        });

});


//@route POST http://localhost:3000/user/login
//@desc user Login
//@access Public
//user login 1.이메일 체크 2. 패스워드 디코딩 3.jwt 4. response
router.post('/login', (req,res) => {

    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    userModel
        .findOne({email : req.body.email})
        .exec()
        .then(user => {
            if(!user){
                return res.json({
                    msg : "등록된 이메일이 없습니다 회원가입 후 로그인 해 주세요"
                });
            }else{

                bcrypt
                    .compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch) {

                            const payload = { id : user.id, name : user.name, avatar : user.avatar};

                            const token = jwt.sign(
                                payload,
                                process.env.SECRET_KEY,
                                {expiresIn : 3600}
                            );

                            return res.json({
                                msg : "successfull login",
                                tokenInfo : 'bearer ' + token
                            });
                        }else{
                            res.json({
                                msg : 'password incorrect'
                            });
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => {
            res.json({
                msg : err.message
            });
        });


});


// @ route GET http://localhost:3000/user/currents
// @ desc user Currents
// @ access Private 
//current user
router.get('/currents', passport.authenticate('jwt', {session : false}) ,(req,res) => {

    res.json({
        id : req.user.id,
        name : req.user.name,
        avatar : req.user.avatar
    });

});

module.exports = router;