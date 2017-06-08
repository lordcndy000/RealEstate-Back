const mysql = require('mysql');

module.exports = {
	secret: 'yoursecret'
};

module.exports = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'realestate_db'
});



