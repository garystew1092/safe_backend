const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const { uploadProfilePicture, getUserInventory, getUserMessages, upMessageRead } = require("../controllers/userController");
const { profileUpload } = require("../middlewares/uploadMiddle");
const router = express.Router();

//Auth Routes
// Update user profile picture

router.post(
    "/update-profile-picture",
    protect,
    profileUpload, // Directly use the middleware
    uploadProfilePicture
);

router.post(
    "/user-inventory",
    protect,
    getUserInventory
);
router.get(

    "/get-message", protect, getUserMessages)

router.put("/update-message", protect, upMessageRead);
module.exports = router;