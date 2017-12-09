/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, passport) {
	app.use('/api/dishes', require('./dishes.js'));
	app.use('/api/users', require('./users.js')(passport));
	//app.use('/api/dishes', equire('./dishes.js'));
	//app.use('/api/recommendation', require('./recommendation.js'));
};
