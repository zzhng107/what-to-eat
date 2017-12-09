// Load required packages
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

// Define our task schema
var UserSchema = new mongoose.Schema({
    email: {type:String, required:true},
    password: {type:String, required:true},
    name:String,
    tag:{type:[{name:String, value:Number}], default:[]},
    like:{type:[String],default:[]}
},{ versionKey: false }); 

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};
// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);