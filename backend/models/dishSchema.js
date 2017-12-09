// Load required packages
var mongoose = require('mongoose');

// Define our task schema
var DishSchema = new mongoose.Schema({

	imgUrl:{type:String, requires:true},
	name:{type:String},
	rating:{type:Number},
	tag:{type:Object, default:{}},
	restaurant:{
		name: {type:String, required:true},		
		business_id:{type:String, requires:true},
		address:{
			coord:{type:[Number], requres:true},
			state:{type:String},
			city:{type:String},
			street: {type:String},
			zipcode:{type:String}
		},
		hours:{},
		stars:{type:Number, default: -1},
		price:{type:Number, default: -1},
	},

},{ versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('Dish', DishSchema);
