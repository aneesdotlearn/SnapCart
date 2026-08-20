const express = require("express");
const router = express.Router();

const { registerUser, loginUser, updateUser, deleteUser, getUserById, getMe, getAllUsers, googleLogin } = require("../Controller/UserController");
const UserAuth = require("../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.put("/update/:id", UserAuth, updateUser);
router.delete("/delete/:id", UserAuth, deleteUser);
router.get("/user/:id", UserAuth, getUserById);
router.get("/me", UserAuth, getMe);
router.get("/", UserAuth, getAllUsers);

module.exports = router;