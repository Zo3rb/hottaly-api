const Hotel = require('../models/Hotel');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createHotel = async (req, res) => {
    try {

        // Getting Submission User ID from express-jwt.
        const userID = req.user._id;

        // Getting Sure its Valid Object id
        if (!ObjectId.isValid(userID)) return res.json({
            message: "Failed to Add a New Hotel Please try Again With True Credentials"
        });

        // Else Create a New Hotel
        const newHotel = await Hotel.create({ ...req.body, postedBy: userID });

        // Send Back Feed Back to The User
        res.json({
            message: "Successfully Added a New Hotel",
            newHotel
        });
    } catch (error) {
        res.status(400).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.indexHotels = async (req, res) => {
    try {
        // 1 --> Field Filtration
        const select = req.query.select ? req.query.select.split(',').join(' ') : [];
        // 2 --> Sorting
        const sort = req.query.sort ? req.query.sort.split(',').join(' ') : "-createdAt";
        // 3 --> Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const startIndex = (page - 1) * limit;

        // Send The Query && Populate The postedBy
        const hotels = await Hotel.find({}).select(select).sort(sort).skip(startIndex).limit(limit).populate("postedBy");

        // Send All Results
        const allResults = await Hotel.countDocuments({});

        res.send({
            message: "Successfully Fetched Hotels",
            fetched: hotels.length,
            allResults,
            hotels
        });

    } catch (error) {
        res.status(500).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.getHotel = async (req, res) => {
    try {
        // Get The Hotel By its Id
        const hotel = await Hotel.findById(req.params.id).populate("postedBy");

        // If Not Valid Id or No Such Hotel
        if (!hotel || !ObjectId.isValid(req.params.id)) {
            return res.status(404).json("Not Found, Please Try Again");
        };

        res.json({
            message: "Successfully Found The Hotel Request",
            hotel
        });

    } catch (error) {
        res.status(500).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.updateHotel = async (req, res) => {
    try {
        // Fetch The Hotel First From The Database
        const hotel = await Hotel.findOneAndUpdate({ _id: req.params.id, postedBy: req.user._id }, { ...req.body }, { new: true });

        // Check if Theres Hotel or Not Valid ID
        if (!hotel || !ObjectId.isValid(req.params.id)) {
            return res.status(404).json("Not Found, Please Try Again");
        };

        // Send The New Document Back
        res.json({
            message: "Successfully Updated The Hotel",
            hotel
        });
    } catch (error) {
        res.status(500).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        // Fetch The Hotel And Delete It
        const hotel = await Hotel.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id }, { ...req.body });

        // Check if Theres Hotel or Not Valid ID
        if (!hotel || !ObjectId.isValid(req.params.id)) {
            return res.status(404).json("Not Found, Please Try Again");
        };

        // Send The New Document Back
        res.json("Successfully Deleted The Requested Document");

    } catch (error) {
        res.status(500).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.getUserHotels = async (req, res) => {
    try {

        const hotels = await Hotel.find({ postedBy: req.user._id });

        res.json({
            message: "Successfully Fetched Hotels",
            fetched: hotels.length,
            hotels
        });

    } catch (error) {
        res.status(500).json(`Something Went Wrong: ${error.message}`);
    }
};
