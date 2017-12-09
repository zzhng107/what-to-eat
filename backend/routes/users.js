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
        users  = require('../models/userSchema');
        restaurants  = require('../models/dishSchema')
        mongoose = require('mongoose')

    router.post('/register',
        passport.authenticate('local-signup'),
        (req, res) => {
            let where = {$where:"this.dishes.length == 1"}
            restaurants.find(where, function(err,res_restaurants){
                console.log(req.isAuthenticated());
                res.status(200).json({ user: req.user, message: "Welcome!",data:res_restaurants});
            });
    });

    router.post('/login',
        passport.authenticate('local-login'),
        (req, res) => {
            let where = {$where:"this.dishes.length == 1"}
            restaurants.find(where, function(err,res_restaurants){
                console.log(req.isAuthenticated());
                res.status(200).json({ user: req.user, message: "Welcome!",data:res_restaurants});
            });
    });

    router.get('/logout', (req, res) => {
        req.logOut();
        res.status(200).json({ message: "logged out "});
    });

    router.put('/like', (req, res) => {
        
        let dish_id = req.body.dish_id;
        dishes.findOne({_id:dish_id}, (err, res_dish)=>{
            if(err){
                res.status(500).send(err);
                return;
            }
            let update_info = {};
            update_info["$push"] = {dish_like:dish_id};
            let dish_tags = res_dish.tag;
            let inc = {};
            for(dish_tag in dish_tags){
                inc[dish_tag] = dish_tags[dish_tag];
            }
            if(!isEmpty(inc)){
                update_info[""]
            }

            users.update({email:req.user.email},{$push:{dish_like:dish_id}},{new:true}, (err,res_user)=>{
                if(err){
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send("Updated "+ req.user.email);

            });

        //users.findByIdAndUpdate({email:req.user.email},{$set:{name:"Naomi"}}, {new: true}, function(err,user){
        //    if(err){
        //        console.log("Something wrong when updating data!");
        //    }
        
        //    console.log(doc);
        //})
       
        
        });
    })
    return router;
}

