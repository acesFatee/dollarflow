const express = require("express");
const verifySignupWebhook = require("../middlewares/verifySignupWebhook");
const router = express.Router();
const UserModel = require("../models/UserModel");
const verifyLoginWebhook = require("../middlewares/verifyLoginWebhook");
const { sign } = require("jsonwebtoken");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const getUserClerkId = require("../middlewares/getUserClerkId");

router.post("/create-user", verifySignupWebhook, async (req, res) => {
  try {
    const { data } = req.body;

    const newUser = new UserModel({
      clerkId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      image: data.image_url,
      email: data?.email_addresses[0]?.email_address,
      funds: 0,
      currency: "USD",
    });

    await newUser.save();

    return res.status(201).json({ newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", verifyLoginWebhook, async (req, res) => {
  const { data } = req.body;
  console.log(data);
  const token = sign(data, process.env.JWT_SECRET);
  return res.status(200).json({ token });
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { funds, currency } = req.body;

    const updateData = {};
    if (funds !== undefined) updateData.funds = funds;
    if (currency !== undefined) updateData.currency = currency;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/get-user",
  ClerkExpressRequireAuth({}),
  getUserClerkId,
  async (req, res) => {
    try {
      console.log(req.user)
      return res.status(200).json({ user: req.user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
