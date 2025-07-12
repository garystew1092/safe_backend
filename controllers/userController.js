const inventory = require("../models/inventory");
const User = require("../models/user");
const Message = require("../models/message"); // Single correct import

// Upload profile picture
const uploadProfilePicture = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user._id;
        const profilePictureUrl = `/uploads/profile/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId, { profileimage: profilePictureUrl }, { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profileimageurl: profilePictureUrl,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during upload",
            error: error.message,
        });
    }
};

// Get user's inventory
const getUserInventory = async(req, res) => {
    try {
        const userId = req.params.userId || req.user.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const Inventory = await inventory.find({ user: userId }).sort({ createdAt: -1 });

        if (!Inventory || Inventory.length === 0) {
            return res.status(404).json({ success: false, message: "No inventory found for this user" });
        }

        res.status(200).json({ success: true, count: Inventory.length, data: Inventory });
    } catch (error) {
        console.error("Error fetching user inventory:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching inventory",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// Get messages sent to the user
const getUserMessages = async(req, res) => {
    try {
        const userId = req.user._id;
        const messages = await Message.find({ recipient: userId }).populate("sender", "firstname lastname profileimage");

        if (!messages || messages.length === 0) {
            return res.status(404).json({ success: false, message: "No messages found for this user" });
        }

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching messages",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// Mark messages as read (if needed)
const upMessageRead = async(req, res) => {
    try {
        const userId = req.user._id;
        const messages = await Message.find({ recipient: userId }).populate("sender", "firstname lastname profileimage");

        if (!messages || messages.length === 0) {
            return res.status(404).json({ success: false, message: "No messages found for this user" });
        }

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching messages",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// Get count of unread messages
const getReadCount = async(req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({ recipient: userId, isread: false }).populate(
            "sender",
            "firstname lastname profileimage"
        );

        if (!messages || messages.length === 0) {
            return res.status(404).json({ success: false, message: "No unread messages found for this user" });
        }

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        console.error("Error fetching unread messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching unread messages",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// Insert a new message (admin -> user)
const insertNewMsg = async(req, res) => {
    try {
        const subject = "Welcome to Grant Trust Security";
        const _message = "Welcome to our new service. Feel free to ask any question by visiting the support section. Have a nice day!";

        // Find the sender (admin)
        const sender = await User.findOne({
            email: "sandra@granttrustservice.org",
            role: "admin",
        }).select("-password");

        if (!sender) {
            return res.status(404).json({
                success: false,
                message: "Admin sender not found",
            });
        }

        // Check if a message with the same subject already exists for this recipient
        const existingMessage = await Message.findOne({
            sender: sender._id,
            recipient: req.user._id,
            subject: subject,
        });

        if (existingMessage) {
            return res.status(409).json({
                success: false,
                message: "Welcome message already sent to this user",
            });
        }

        // Create and save new message
        const newMessage = new Message({
            sender: sender._id,
            recipient: req.user._id,
            subject,
            message: _message,
        });

        await newMessage.save();
        console.log("Message saved successfully");

        res.status(200).json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        console.error("Error inserting message:", error);
        res.status(500).json({
            success: false,
            message: "Server error while inserting message",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};


module.exports = {
    uploadProfilePicture,
    getUserInventory,
    getUserMessages,
    getReadCount,
    upMessageRead,
    insertNewMsg,
};