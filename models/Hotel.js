const mongoose = require('mongoose');

// Declaring The Hotel Schema
const HotelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true, default: "https://via.placeholder.com/300/?text=No%20Image%20Provided" },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    beds: { type: Number, required: true }
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports = Hotel;
