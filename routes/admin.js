const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/secret');
const Admin = require('../models/admin_model');

// Register
router.post('/register', (req, res, next) => {
	let newAdmin = {
		admin_name: req.body.admin_name,
		admin_username: req.body.admin_username,
		admin_password: req.body.admin_password,
		admin_img: req.body.admin_img,
		admin_datereg: new Date()
	};

	Admin.addAdmin(res, newAdmin, (err, admin) => {
		if(err){
			res.json({success: false, msg: 'Failed to register admin'});
		} else {
			res.json({success: true, msg: 'Admin registered'});
		}
	});
});

// Login
router.post('/login', (req, res, next) => {
	res.send('Login');
});	

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const admin_username = req.body.admin_username;
	const admin_password = req.body.admin_password;

	Admin.getAdminByUsername(admin_username, (err, admin) => {
		if(err) throw err;
		if(admin.length == 0){
			res.json({success: false, msg: 'Admin not found'});
			// console.log(result[0].admin_id);
		}
		for(let i in admin){
			Admin.comparePassword(admin_password, admin[i].admin_password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch){
					const token = jwt.sign(admin[0], config.secret, {
						expiresIn: 604800 // 1 week
					});

					res.json({
						success: true,
						token: 'JWT '+token,
						admin: {
							admin_id: admin[i].admin_id,
							admin_name: admin[i].admin_name,
							admin_username: admin[i].admin_username,
							admin_img: admin[i].admin_img,
							admin_datereg: admin[i].admin_datereg,
						}
					});
					// return res.json({success: true, msg: 'correct password'});
				} else {
					return res.json({success: false, msg: 'Incorrect password'});
				}
			});
		}
	});
});

// dashboard
router.post('/dashboard', (req, res, next) => {
	res.send('dashboard');
});

// user_type
router.post('/user_type/agent', (req, res, next) => {
	res.send('agent');
});

router.post('/user_type/client', (req, res, next) => {
	res.send('client');
});

// listings
router.post('/listings', (req, res, next) => {
	res.send('listings');
});

// profile
router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
	res.json({admin: req.admin});
});

module.exports = router;