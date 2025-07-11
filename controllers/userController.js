const inventory = require("../models/inventory");
// const message = require("../models/message");
const User = require("../models/user")
const Message = require("../models/message"); // Add this line at the top with your other imports
const uploadProfilePicture = async(req, res) => {
    try {
        // Check if file exists (using multer's file handling)
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const userId = req.user._id;

        // Process the file (example using Cloudinary)
        // const result = await cloudinary.uploader.upload(req.file.path);

        // Or for local storage:
        const profilePictureUrl = `/uploads/profile/${req.file.filename}`;

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId, { profileimage: profilePictureUrl }, { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profileimageurl: profilePictureUrl,
            user: updatedUser
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during upload",
            error: error.message
        });
    }
};

const getUserInventory = async(req, res) => {
    try {
        // 1. Get user ID from request (could be from params, body, or auth token)
        const userId = req.params.userId || req.user.id; // Adjust based on your auth setup

        // 2. Validate user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // 3. Fetch inventory from database
        // Example using MongoDB (adjust for your database)
        const Inventory = await inventory.find({
                user: userId
            })
            .sort({ createdAt: -1 }); // Newest first

        // 4. If no inventory found
        if (!Inventory || Inventory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No inventory found for this user"
            });
        }

        // 5. Successful response
        res.status(200).json({
            success: true,
            count: Inventory.length,
            data: Inventory
        });

    } catch (error) {
        console.error("Error fetching user inventory:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching inventory",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getUserMessages = async(req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using JWT and have user info in req.user
        const message = await Message.find({ recipient: userId }).populate('sender', 'firstname lastname profileimage');

        if (!message || message.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No messages found for this user"
            });
        }

        res.status(200).json({
            success: true,
            count: message.length,
            data: message
        });


    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching messages",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

}

const upMessageRead = async(req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using JWT and have user info in req.user
        const messages = await Message.find({ recipient: userId }).populate('sender', 'firstname lastname profileimage');

        if (!messages || messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No messages found for this user"
            });
        }

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching messages",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
    uploadProfilePicture,
    getUserInventory,
    getUserMessages,
    upMessageRead
};