//bcryptjs is a library that allows you to hash passwords and compare them securely. It is commonly used in user authentication systems to ensure that passwords are stored in a secure manner.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide a name"],
    },

    email: {
        type: String,
        required: [true, "Please Provide an email"],
        unique: true,
    },

    password: {
        type: String,
        minlength: [10, "Password must be at least 10 characters long"],
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

module.exports = mongoose.model("UserModel", userSchema);