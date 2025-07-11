const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({



        //Message schema defintion
        subject: { type: String, required: true },
        message: { type: String, required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isread: { type: Boolean, default: false },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },






    }, { timestamps: true }

);

module.exports = mongoose.model("Message", MessageSchema);