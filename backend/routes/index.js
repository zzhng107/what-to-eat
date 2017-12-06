/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app) {
	app.use('/api/restaurants', require('./restaurants.js'));
	//app.use('/api/users', require('./users.js'));
	//app.use('/api/dishes', equire('./dishes.js'));
	//app.use('/api/recommendation', require('./recommendation.js'));
};
