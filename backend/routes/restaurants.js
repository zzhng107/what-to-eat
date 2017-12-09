var express = require('express'), 
	router = express.Router(),
	restaurants  = require('../models/restaurantSchema');
	mongoose = require('mongoose')

router.get('/', function(req,res){

	let where = {};
	let limit = 100;
	let sort = {};
	let select = {};
	let skip = 0;
	
	if(req.query.hasOwnProperty('where')){
		where = JSON.parse(req.query.where);
	}
	if(req.query.hasOwnProperty('limit')){
		limit = parseInt(req.query.limit);
	}
	if(req.query.hasOwnProperty('skip')){
		skip = parseInt(req.query.skip);
	}
	


	restaurants.find(where).
		limit(limit).
		sort(sort).
		select(select).
		skip(skip).
		count(function(err,count){
			if(err){
				res.status(500).send({
				message: 'Server Error',
				data:[]
				});
			}else{
				//
				res.status(200).send({
					message:'OK',
					data:count
				})
			}
		})



});



router.get('/:id', function(req,res){
	
	let select = {};
	
	if(req.query.hasOwnProperty('select')){
		select = JSON.parse(req.query.select);
	}

	restaurants.findById(req.params.id).
		select(select).
		exec(
			function(err,res_restaurant){
				if(err){
					res.status(500).send({
						message: 'Server Error',
						data:{}
					});
				}else if(res_restaurant===null){
					res.status(404).send({
						message: 'restaurant Not Found',
						data:{}
					});
				}else {
					res.status(200).send({
						message:'OK',
						data:res_restaurant
					})
				}
			}
		)
	
});

module.exports = router;
