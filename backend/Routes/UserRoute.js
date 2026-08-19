const express = require("express");
const router = express.Router();

const { registerUser, loginUser, updateUser, deleteUser, getUserById, getMe, getAllUsers, googleLogin } = require("../Controller/UserController");
const UserAuth = require("../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/user/:id", getUserById);
router.get("/me", getMe);
router.get("/", getAllUsers);

module.exports = router;