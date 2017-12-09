var express = require('express'), 
	router = express.Router(),
	dishes  = require('../models/dishSchema');
	users = require('../models/userSchema')
	mongoose = require('mongoose')

router.post('/', function(req,res){

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

	function get_score(rest_tag_dic, user_tag_dic){
		let score = 0;
		// if(!Object.keys(rest_tag_dic).length || !Object.keys(user_tag_dic).length){
		// 	return score;
		// }
		// console.log("should not see me");
		for(let key of Object.keys(rest_tag_dic)){
			if(key in Object.keys(user_tag_dic)){
				score += rest_tag_dic[key] * user_tag_dic[key];
			}
		}
		return score;
	}

	dishes.find(where).
		limit(limit).
		sort(sort).
		select(select).
		skip(skip).
		exec((err,dish)=>{
			if(err){
				res.status(500).send({
					message: err,
				});
				return;
			}
			//recommendation processing
			let out;
			users.findOne({'email':req.body.email})
			.exec((err, user_t)=>{
				if(err){
					res.status(500).send({
						message: err,
					})
					return;
				}
				out = dish.map((val, ind)=>{
					let score = get_score(val.tag, user_t.tag);
					let temp = {};
					let item = JSON.parse(JSON.stringify(val));
					Object.assign(temp, item);
					Object.assign(temp, {score: score});
					return temp;
				})
				res.status(200).send({
					message:'OK',
					data:out
				})
			})
			
		})

});



// router.get('/:id', function(req,res){
	
// 	let select = {};
	
// 	if(req.query.hasOwnProperty('select')){
// 		select = JSON.parse(req.query.select);
// 	}

// 	restaurants.findById(req.params.id).
// 		select(select).
// 		exec(
// 			function(err,res_restaurant){
// 				if(err){
// 					res.status(500).send({
// 						message: err,
// 					});
// 				}else if(res_restaurant===null){
// 					res.status(404).send({
// 						message: err
// 					});
// 				}else {
// 					res.status(200).send({
// 						message:'OK',
// 						data:res_restaurant
// 					})
// 				}
// 			}
// 		)
	
// });

module.exports = router;
