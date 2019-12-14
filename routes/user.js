const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//user register 1.이메일 유무체크 2.아바타 생성 3. usermodel 4.password 암호화 5. response

router.post('/register', (req,res) => {

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

//user login 1.이메일 체크 2. 패스워드 디코딩 3.jwt 4. response
router.post('/login', (req,res) => {

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
                                'secret',
                                {expiresIn : 3600}
                            );

                            return res.json({
                                msg : "successfull login",
                                tokenInfo : 'bearer' + token
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

//current user
router.get('/currents', (req,res) => {

});

module.exports = router;