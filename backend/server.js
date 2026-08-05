const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDB = require("./Config/db");
const ProductRoutes = require("./Routes/ProductRoutes");
const userRoutes = require("./Routes/UserRoute");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", ProductRoutes);
app.use("/users/", userRoutes);

connectToDB();
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.get("/test", (req, res) => {
    res.send("Test Route Working");
});


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});