const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const verifyWebhook = require("./middlewares/verifyWebhook");


app.post("/test-webhook", verifyWebhook, async (req, res) => {
  console.log(req.body);
  return res.status(201).json({ success: "ok" });
});

app.listen(PORT, () => {
  console.log("App is up on port " + PORT);
});
