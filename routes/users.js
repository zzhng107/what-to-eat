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
            res.status(200).json({message:`Registered ${req.user.email}`});
        }
    );

    router.post('/login',
        passport.authenticate('local-login'),
        (req, res) => {
            res.status(200).json({message:`Logged in as ${req.user.email}`}); 
        }
    );

    router.get('/logout', (req, res) => {
        req.logOut();
        res.status(200).json({message:"logged out"});
    });

    router.put('/like', (req, res) => {
        
        //let dish_id = req.body.dish_id;
        let imgUrl = req.body.imgUrl;
        let email= req.body.email;
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
            //users.findOneAndUpdate({email:req.user.email},update_info,(err,res_user)=>{
            users.findOneAndUpdate({email:email},update_info,(err,res_user)=>{
                if(err){
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({message:"Updated "+ email});

            });
        });
    });

    router.put('/dislike', (req, res) => {
        let imgUrl = req.body.imgUrl;
        let email= req.body.email;
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

            //users.findOneAndUpdate({email:req.user.email},update_info,(err,res_user)=>{
            users.findOneAndUpdate({email:email},update_info,(err,res_user)=>{
                if(err){
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({message:"Updated "+ email});

            });
        });
    });


    router.put('/saveForLater',(req, res) =>{
        let imgUrl = req.body.imgUrl;
        let email= req.body.email; 
        let update_info = {};
        update_info["$push"] = {save_for_later:imgUrl};
        users.findOneAndUpdate({email:email},update_info,(err,res_user)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            res.status(200).json({message:"Updated "+ email});
        });
    })


    router.post('/dietHistory', (req, res)=>{
        let out = [];
        users.findOne({email:req.body.email}, (err, user_info)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            out = user_info.dish_like.concat(user_info.dish_dislike);
            res.status(200).json(out);
        })
    })

    router.post('/saveForLater', (req, res)=>{
        let out = [];
        users.findOne({email:req.body.email}, (err, user_info)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            res.status(200).json(user_info.save_for_later);
        })
    })



    return router;
}

