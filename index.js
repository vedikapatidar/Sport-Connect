var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.port;
const uri = process.env.mongodb_uri;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('dashboard'));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Updated MongoDB Atlas connection string
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Sign Up Route
app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    var data = {
        "name": name,
        "email": email,
        "phno": phno,
        "username": username,
        "password": password,
        "role": role
    };

    mongoose.connection.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    switch(role) {
        case 'admin':
            return res.redirect('admindashboard.html');
        case 'coordinator':
            return res.redirect('coordinatordashboard.html');
        case 'instructor':
            return res.redirect('instructordashboard.html');
        case 'student':
            return res.redirect('studentdashboard.html');
        default:
            return res.redirect('index.html');
    }
});

// Login Route
app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    mongoose.connection.collection('users').findOne({ "username": username, "password": password, "role": role }, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            console.log("Login Failed: User not found or wrong credentials");
            return res.redirect('login_failed.html'); // Redirect to a failure page
        } else {
            console.log("Login Successful");

            switch(user.role) {
                case 'admin':
                    return res.redirect('admindashboard.html');
                case 'coordinator':
                    return res.redirect('coordinatordashboard.html');
                case 'instructor':
                    return res.redirect('instructordashboard.html');
                case 'student':
                    return res.redirect('studentdashboard.html');
                default:
                    return res.redirect('index.html');
            }
        }
    });
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve index.html
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
   console.log(`Server is running on Port ${port}`);
});