const UserModel = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(
    process.env.VITE_GOOGLE_CLIENT_ID
);


const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            name,
            email,
            picture,
            email_verified,
        } = payload;

        if (!email || !email_verified) {
            return res.status(400).json({
                success: false,
                message: "Google email could not be verified",
            });
        }

        let user = await UserModel.findOne({
            $or: [
                { googleId },
                { email }
            ],
        });

        // Existing user
        if (user) {

            // Link Google account if this email already
            // belongs to a normal SnapCart account
            if (!user.googleId) {
                user.googleId = googleId;
            }

            if (user.authProvider !== "google") {
                user.authProvider = "google";
            }

            await user.save();
        }

        // New Google user
        if (!user) {
            user = await UserModel.create({
                name,
                email,
                googleId,
                authProvider: "google",
                role: "user",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            "secret_key",
            {
                expiresIn: "8h",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                googleId: user.googleId,
                authProvider: user.authProvider,
            },
        });

    } catch (error) {
        console.error("Google login error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed",
            error: error.message,
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;// Destructure the request body to get user details
        
        if (!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        const existingUser = await UserModel.findOne({ email }); // Check if a user with the same email already exists becaouse email is unique


        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        let hashedPassword;
        try {
        hashedPassword = await bcrypt.hash(password, 10); // hashing the password with a salt round of 10
        } catch (hashErr) {
        return res
            .status(500)
            .json({ success: false, message: "Password hashing failed" });
        }

        const newuser = await UserModel.create({
          name,
          email,
          password: hashedPassword,
          role
        }); // Create a new user with the hashed password

        
        const token = jwt.sign({ id: newuser._id }, "secret_key", {
        expiresIn: "8h",
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newuser
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to create user',
            error: error.message
         });
    }
};


// LOGIN EXISTING USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // destructuring the request body to get user details

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    console.log("User: ", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "8h" });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await UserModel.findById(req.params.id);
    console.log("User: ", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name; // user.name = name in db, name = name in req.body.
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};


// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    console.log("User: ", deletedUser);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Deleting user with ID: ", req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// GET LOGGED-IN USER PROFILE (GET /me)
const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser, getUserById, getMe, getAllUsers, googleLogin };
