require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectToDB = require("./Config/db");

const ProductRoutes = require("./Routes/ProductRoutes");
const userRoutes = require("./Routes/UserRoute");
const orderRoutes = require("./Routes/OrderRoutes");

const { connectRedis } = require("./Config/redis");


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// ROUTES
// =====================================================

app.use("/", ProductRoutes);

app.use("/users", userRoutes);

app.use("/orders", orderRoutes);


// =====================================================
// BASIC ROUTES
// =====================================================

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.get("/test", (req, res) => {
  res.send("Test Route Working");
});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;


const startServer = async () => {
  try {

    // Connect MongoDB
    await connectToDB();

    // Connect Redis
    await connectRedis();

    // Start Express
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Failed to start server:", error);

    process.exit(1);
  }
};


startServer();