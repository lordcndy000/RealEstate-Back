const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const mysql = require('mysql');
const config = require('./config/database');

// Connect to database
config.connect((err) => {
	if(err) throw err;
	console.log("Connected to database");
	// console.log(config.secret);
});

// Initialize Express
const app = express();

const admin = require('./routes/admin');

// Port
const port = 3000;

// CORS Middleware
app.use(cors());

// Set static folder (Angular)
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/admin', admin);

// Route
app.get('/', (req, res) => {
	res.send('Invalid endpoint');
});

// Listen to the port. Start the server
app.listen(port, () => {
	console.log('Server started on port '+port);
});