

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "unable to auth" });
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = (passport)=> {
    var express = require('express'), 
        router = express.Router(),
        users  = require('../models/userSchema'),
        dishes  = require('../models/dishSchema'),
        mongoose = require('mongoose'),
        ObjectId = require('mongodb').ObjectId;

    router.post('/register',
        passport.authenticate('local-signup'),
        (req, res) => {
            res.status(200).send(`Registered ${req.user.email}`);
        }
    );

    router.post('/login',
        passport.authenticate('local-login'),
        (req, res) => {
            res.status(200).send(`Logged in ${req.user.email}`); 
        }
    );

    router.get('/logout', (req, res) => {
        req.logOut();
        res.status(200).send("logged out");
    });


    router.put('/like', (req, res) => {
        
        //let dish_id = req.body.dish_id;
        let imgUrl = req.body.imgUrl;
        dishes.findOne({imgUrl: imgUrl}, (err, res_dish)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            let update_info = {};
            update_info["$push"] = {dish_like:imgUrl};
            let dish_tags = res_dish.tag;
            let inc = {};
            for(dish_tag in dish_tags){
                inc[`tag.${dish_tag}`] = dish_tags[dish_tag];
            }
            
            if(!isEmpty(inc)){
                update_info["$inc"] = inc;
            }
            console.log(update_info);
            users.findOneAndUpdate({email:req.user.email},update_info,(err,res_user)=>{
                if(err){
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send("Updated "+ req.user.email);

            });
        });
    });

    router.put('/dislike', (req, res) => {
        
        let imgUrl = req.body.imgUrl;
        dishes.findOne({imgUrl: imgUrl}, (err, res_dish)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            let update_info = {};
            update_info["$push"] = {dish_dislike:imgUrl};
            let dish_tags = res_dish.tag;
            let inc = {};
            for(dish_tag in dish_tags){
                inc[`tag.${dish_tag}`] = -dish_tags[dish_tag];
            }
            
            if(!isEmpty(inc)){
                update_info["$inc"] = inc;
            }

            users.findOneAndUpdate({email:req.user.email},update_info,(err,res_user)=>{
                if(err){
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send("Updated "+ req.user.email);

            });
        });
    });

        
    return router;
}

