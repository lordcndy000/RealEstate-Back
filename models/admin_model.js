const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

module.exports.getAdminById = (admin_id, callback) => {
	// Get the ID
	let get_id = "SELECT * FROM ?? WHERE ?? = ?";
	const get_id_value = ['admin_tbl', 'admin_id', admin_id];
	get_id = mysql.format(get_id, get_id_value);
	config.query(get_id, callback);
}

module.exports.getAdminByUsername = (admin_username, callback) => {
	// Get the Username
	let get_username = "SELECT * FROM ?? WHERE ?? = ?";
	const get_username_value = ['admin_tbl', 'admin_username', admin_username];
	get_username = mysql.format(get_username, get_username_value);
	config.query(get_username, callback);
}

module.exports.addAdmin = (res, newAdmin, callback) => {
	// Check if the username already exists
	let check_username = "SELECT ?? FROM ?? WHERE ?? = ?";
	const check_username_value = ['admin_username','admin_tbl', 'admin_username', newAdmin.admin_username];
	check_username = mysql.format(check_username, check_username_value);
	config.query(check_username, (err, result) => {
		if(err) throw err;
		// If exists...
		if(result.length != 0) {
			res.json({success: false, msg: 'Failed to register admin. Username already exists'});
		} else {
			// If doesn't exists...
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newAdmin.admin_password, salt, (err, hash) => {
					if(err) throw err;
					newAdmin.admin_password = hash;
					let insert_admin = "INSERT INTO ?? VALUES(??,?,?,?,?,?)";
					const insert_admin_value = [
						'admin_tbl', 
						'admin_id',
						newAdmin.admin_name, 
						newAdmin.admin_username, 
						newAdmin.admin_password,
						newAdmin.admin_img,
						newAdmin.admin_datereg
					];
					insert_admin = mysql.format(insert_admin, insert_admin_value);
					config.query(insert_admin, callback);
				});
			});
		}
	})
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
};
