module.exports = function(passport) {
    var express = require('express'), 
        router = express.Router(),
        users  = require('../models/userSchema');
        restaurants  = require('../models/restaurantSchema')
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
        
       console.log(req.user.email);
       
        
    });

    return router;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "unable to auth" });
}
