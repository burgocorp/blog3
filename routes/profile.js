const express = require('express');
const router = express.Router();
const profileModel = require('../models/profile');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session : false});

//@ route POST http://localhost:3000/profile
//@ desc register userProfile
//@ access Private
router.post('/', authCheck, (req,res) => {

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.split(',');
    }

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {
            if(profile){
               

            }else{
                new profileModel(profileFields)
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err))
            }
        })
        .catch(err => res.json(err))

});

module.exports = router;


