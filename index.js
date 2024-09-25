var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const path = require('path');

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static('dashboard'))
app.use('/images', express.static('images'))
app.use(bodyParser.urlencoded({
    extended: true
}))

// mongoose.connect('mongodb://localhost:27017/SportConnectData')
// var db = mongoose.connection
// db.on('error', () => console.log("Error in Connecting to Database"))
// db.once('open', () => console.log("Connected to Database"))

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://vedika:sport@sportconnect.6dm9r.mongodb.net/';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', () => console.log("Error in Connecting to Database"))
db.once('open', () => console.log("Connected to MongoDB Atlas"))


// Sign Up Route
app.post("/sign_up", (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var phno = req.body.phno
    var username = req.body.username
    var password = req.body.password
    var role = req.body.role

    var data = {
        "name": name,
        "email": email,
        "phno": phno,
        "username": username,
        "password": password,
        "role":role
    }

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err
        }
        console.log("Record Inserted Successfully")
    })
    switch(role) {
        case 'admin':
            return res.redirect('admindashboard.html')
        case 'coordinator':
            return res.redirect('coordinatordashboard.html')
        case 'instructor':
            return res.redirect('instructordashboard.html')
        case 'student':
            return res.redirect('studentdashboard.html')
        default: // For student or any other default role
            return res.redirect('index.html')
    }
})

// Login Route
app.post("/login", (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var role = req.body.role

    db.collection('users').findOne({ "username": username, "password": password, "role":role }, (err, user) => {
        if (err) {
            throw err
        }
        if (!user) {
            console.log("Login Failed: User not found or wrong credentials")
            return res.redirect('login_failed.html') // Redirect to a failure page
        } else {
            console.log("Login Successful")
            // Redirect to the dashboard or a successful login page

            switch(user.role) {
                case 'admin':
                    return res.redirect('admindashboard.html')
                case 'coordinator':
                    return res.redirect('coordinatordashboard.html')
                case 'instructor':
                    return res.redirect('instructordashboard.html')
                case 'student':
                    return res.redirect('studentdashboard.html')
                default: // For student or any other default role
                    return res.redirect('index.html')
            }
        }
    })
})

// app.get("/", (req, res) => {
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     })
//     return res.redirect('index.html')
// }).listen(3000);

// console.log("Listening on port 3000")


// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve index.html
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
   console.log("Listening on port 3000");
});
