const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "member"], default: "user" },
        country: { type: String, required: true },
        state: { type: String, required: true },
        address: { type: String, required: true },
        postalcode: { type: String, required: true },
        profileimage: { type: String, required: false, default: null },


    }, { timestamps: true }

);

module.exports = mongoose.model("User", UserSchema);