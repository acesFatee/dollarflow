const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require('./routes/categoryRoutes')
const connectToMongo = require("./connectToMongo");
const cookieParser = require("cookie-parser");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const cors = require("cors");

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.get('/', (req, res) => {
  return res.status(200).json("DollarFlow API - Expense Tracking App API")
})

app.use("/api/users", userRoutes);
app.use("/api/transactions", ClerkExpressRequireAuth({}), transactionRoutes);
app.use("/api/categories", ClerkExpressRequireAuth({}), categoryRoutes);

app.listen(PORT, () => {
  console.log("App is up on port " + PORT);
});
