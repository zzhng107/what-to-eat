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

	function get_score(rest_list, user_tag){
		let score = 0;
		rest_list.forEach((ele)=>{
			user_tag.forEach((u_ele)=>{
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
					message: 'ERROR during get restaurant',
					data:[]
				});
				return;
			}
				//recommendation processing
				let user_tag;
				let out;
				console.log("{email:"+req.query.email+"}");

				// users.findone(JSON.parse("{email:"+req.query.email+"}"))
				users.findOne()
				.exec((err, user_t)=>{
					if(err){
						res.status(500).send({
							message:'ERROR during get user',
						})
						return;
					}
					user_tag = user_t.tag;
				})
				out = restaurant.map((val, ind)=>{
					let score = get_score(val, user_tag);
					return {val: score};
				})
				res.status(200).send({
					message:'OK',
					data:out
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
