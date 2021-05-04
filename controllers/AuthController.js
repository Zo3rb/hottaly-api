const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        // Checking if The User is Already Registered
        const registeredUser = await User.findOne({ email: req.body.email });
        if (registeredUser) return res.status(400).json("This User Is Already Registered With This Email");
        // Register a New User
        const newUser = await User.create(req.body);
        res.status(201).json({
            message: "Successfully Registered a New User",
            data: newUser
        });
    } catch (error) {
        res.status(400).json(`Failed to Register a New User: ${error.message}`);
    }
};

exports.login = async (req, res) => {
    try {
        // Getting The User From The Credentials
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // Generating an Access Token for The User
        const token = jwt.sign({ _id: user._id }, process.env.APPLICATION_SECRET_KEY, { expiresIn: "7d" });
        res.json({
            message: "Successfully Logged In",
            data: { user, token }
        });
    } catch (error) {
        res.status(400).json(`Failed to login: ${error.message}`);
    }
};
