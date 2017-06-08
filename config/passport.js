const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('../models/admin_model');
const config = require('../config/database');
const secret = require('../config/secret');

module.exports = (passport) => {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = secret.secret;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		// console.log(jwt_payload);
		Admin.getAdminById(jwt_payload.admin_id, (err, admin) => {
			if(err){
				return done(err, false);
			}
			if(admin){
				return done(null, admin);
			} else {
				return done(null, false);
			}
			
		});
	}));
}