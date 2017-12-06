// Load required packages
var mongoose = require('mongoose');

// Define our task schema
var RestaurantSchema = new mongoose.Schema({
	business_id:{type:String, requires:true},
    name: {type:String, required:true},
	address:{
		coord:{type:[Number], requres:true},
		state:{type:String},
		city:{type:String},
		street: {type:String},
		zipcode:{type:String}
	},
	hours:{},
	stars:{type:Number, default: -1},
	RestaurantsPriceRange2:{type:Number, default: -1},
	dishes:{type:[{}], default:[]}

},{ versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('Restaurant', RestaurantSchema);
