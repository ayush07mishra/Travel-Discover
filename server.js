const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "html");
mongoose.connect('mongodb://localhost:27017/login_signup');


app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



app.use(express.static(path.join(__dirname, 'public')));



// Sign up route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).send("User registered successfully");
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).send("Invalid credentials");

    res.send("Login successful");
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
