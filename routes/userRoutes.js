const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const { uploadProfilePicture, getUserInventory, getUserMessages, upMessageRead, getReadCount, insertNewMsg } = require("../controllers/userController");
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


router.get("/get-unread-messages", protect, getReadCount);

router.put("/update-message", protect, upMessageRead);

router.post(
    "/insert-welcome-message",
    protect,
    insertNewMsg
);
module.exports = router;