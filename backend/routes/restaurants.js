var express = require('express'), 
	router = express.Router(),
	restaurants  = require('../models/restaurantSchema');
	users = require('../models/userSchema')
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

	function get_score(rest_tag_list, user_tag_list){
		let score = 0;
		console.log(typeof(rest_tag_list));
		console.log(user_tag_list);

		if(!rest_tag_list || !user_tag_list){
			return score;
		}

		rest_tag_list.forEach((ele)=>{
			user_tag_list.forEach((u_ele)=>{
				if(ele.name == u_ele.name){
					score += ele.value * u_ele.value;
				}
			})
		});
	}

	restaurants.find(where).
		limit(limit).
		sort(sort).
		select(select).
		skip(skip).
		exec((err,restaurant)=>{
			if(err){
				res.status(500).send({
					message: err,
				});
				return;
			}
			//recommendation processing
			let out;
			users.findOne({'email':req.query.email})
			.exec((err, user_t)=>{
				if(err){
					res.status(500).send({
						message: err,
					})
					return;
				}
				out = restaurant.map((val, ind)=>{
					let score = get_score(val.dishes.tag, user_t.tag);
					return {dish_in_restaurant:val, score:score};
				})
				res.status(200).send({
					message:'OK',
					data:out
				})
			})
			
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
						message: err,
					});
				}else if(res_restaurant===null){
					res.status(404).send({
						message: err
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
