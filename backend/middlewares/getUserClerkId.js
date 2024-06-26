
const UserModel = require("../models/UserModel");

async function getUserClerkId(req, res, next) {
  try {
    const clerkId = req?.auth?.userId;
    if (!clerkId) {
      return res.status(400).json({ error: "No clerk Id" });
    }
    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return res
        .status(400)
        .json({ error: `No user with clerk id ${clerkId} found` });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = getUserClerkId
