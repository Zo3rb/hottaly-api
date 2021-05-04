const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Declaring The User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    stripe_account_id: { type: String, default: "" },
    stripe_seller: {},
    stripeSession: {}
}, {
    timestamps: true
});

// Preventing Return Password When Returning User Document
UserSchema.methods.toJSON = function () {
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// Find User by It's Credentials for Login
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Hashing The Password Before Saving to The Database (and/or) After Changing it.
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 8);
        this.password = hashedPassword;
        next();
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
