const express = require("express");
const router = express.Router();

const { registerUser, loginUser, updateUser, deleteUser, getUserById, getMe } = require("../Controller/UserController");
const UserAuth = require("../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id",UserAuth, deleteUser);
router.get("/user/:id",getUserById);
router.get("/me", UserAuth, getMe);
module.exports = router;