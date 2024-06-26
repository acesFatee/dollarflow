const express = require("express");
const router = express.Router();
const getUserClerkId = require("../middlewares/getUserClerkId");
const CategoryModel = require("../models/CategoryModel");

//Get all Categories

router.get("/", getUserClerkId, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5
    const skip = (page - 1) * limit;

    let query = {}
    if(req.query.search !== "null"){
      const regex = new RegExp(req.query.search, 'i')
      query.name = regex;
    }

    const categories = await CategoryModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })

    const totalCategories = await CategoryModel.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/create-category", getUserClerkId, async (req, res) => {
  try {
    const { name, limit, isExpense} = req.body;
    const newCategory = await CategoryModel.create({
      name,
      user: req.user._id,
      isExpense,
      limit,
      spent: 0,
    })
    return res.status(201).json({ newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/update-category/:id', getUserClerkId, async(req, res) => {
  try {
    const {name, limit} = req.body;
    const categoryToUpdate = await CategoryModel.findByIdAndUpdate(req.params.id, {
      name,
      limit
    }, {new: true})

    return res.status(200).json({category: categoryToUpdate})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

router.get("/search", getUserClerkId, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query missing" });
    }
    
    const regex = new RegExp(query, "i");
    const categories = await CategoryModel.find({
      $and: [
        { name: regex },
        { user: req.user._id }
      ]
    });

    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
