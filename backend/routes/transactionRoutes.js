const express = require("express");
const router = express.Router();
const TransactionModel = require("../models/TransactionModel");
const getUserClerkId = require("../middlewares/getUserClerkId");
const UserModel = require("../models/UserModel");
const CategoryModel = require("../models/CategoryModel");
const mongoose = require("mongoose");

router.get("/", getUserClerkId, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const filter = req.query.filter;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    let categoryName = "";

    let query = { user: req.user._id };

    if (filter === "income") {
      query.isIncome = true;
    } else if (filter === "expense") {
      query.isExpense = true;
    } else if (filter === "null") {
      query.$or = [{ isIncome: true }, { isExpense: true }];
    }

    if (req.query.category !== "null") {
      query.category = req.query.category;
      if (!mongoose.Types.ObjectId.isValid(query.category)) {
        return res.status(400).json({ error: "Not a valid ID" });
      }
      const categoryNameResponse = await CategoryModel.findById(
        req.query.category
      );
      if (!categoryNameResponse) {
        return res.status(400).json({ error: "No Category Found" });
      }
      categoryName = categoryNameResponse.name;
    }

    if (req.query.search !== "") {
      const regexp = new RegExp(req.query.search, "i");
      query.name = regexp;
    }

    // Adding date range filter
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    query.createdAt = { $gte: startDate, $lte: endDate };

    const transactions = await TransactionModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("category");

    const totalTransactions = await TransactionModel.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    return res.status(200).json({
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions,
      categoryName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/recent", getUserClerkId, async (req, res) => {
  try {
    const recentTransactions = await TransactionModel.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category");

    return res.status(200).json({ recentTransactions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/create-expense", getUserClerkId, async (req, res) => {
  try {
    const { name, amount, description, category } = req.body;
    const parsedAmount = Number(amount);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const categoryForExpense = await CategoryModel.findById(category);
    if (!categoryForExpense) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const user = req.user;
    if (user.funds < parsedAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    let updatedUserFunds;

    const userToUpdate = await UserModel.findOne({
      _id: user._id,
      "history.year": currentYear,
      "history.month": currentMonth,
    });

    if (userToUpdate) {
      updatedUserFunds = await UserModel.findOneAndUpdate(
        {
          _id: user._id,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $inc: { "history.$.spent": parsedAmount, funds: -parsedAmount },
        },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: parsedAmount,
        earned: 0,
        month: currentMonth,
        year: currentYear,
      };
      updatedUserFunds = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $push: { history: newHistoryEntry },
        },
        { new: true }
      );
    }

    let updatedCategoryAmount;

    // Check if there is an existing history entry for the current month and year
    const categoryToUpdate = await CategoryModel.findOne({
      _id: category,
      "history.year": currentYear,
      "history.month": currentMonth,
      user: req.user._id,
    });

    if (categoryToUpdate) {
      // Update the existing history entry
      updatedCategoryAmount = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        { $inc: { "history.$.spent": parsedAmount } },
        { new: true }
      );
    } else {
      // Add a new history entry
      const newHistoryEntry = {
        spent: parsedAmount,
        earned: 0,
        month: currentMonth,
        year: currentYear,
      };
      updatedCategoryAmount = await CategoryModel.findByIdAndUpdate(
        category,
        {
          $push: { history: newHistoryEntry },
        },
        { new: true }
      );
    }

    const newExpenseObject = await TransactionModel.create({
      name,
      amount: parsedAmount,
      description,
      category,
      isExpense: true,
      user: user._id,
    });

    const newExpense = await TransactionModel.findById(
      newExpenseObject._id
    ).populate("category");

    return res.status(201).json({
      updatedUser: updatedUserFunds,
      updatedCategory: updatedCategoryAmount,
      newExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add-income", getUserClerkId, async (req, res) => {
  try {
    const { name, amount, category, description } = req.body;
    const parsedAmount = Number(amount);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let updatedUser;

    const userToUpdate = await UserModel.findOne({
      _id: req.user._id,
      "history.year": currentYear,
      "history.month": currentMonth,
    });

    if (userToUpdate) {
      updatedUser = await UserModel.findOneAndUpdate(
        {
          _id: req.user._id,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $inc: {
            funds: parsedAmount,
            "history.$.earned": parsedAmount,
          },
        },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: parsedAmount,
        earned: 0,
        month: currentMonth,
        year: currentYear,
      };
      updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $push: { history: newHistoryEntry },
        },
        { new: true }
      );
    }

    // Check if there is an existing history entry for the current month and year
    const categoryToUpdate = await CategoryModel.findOne({
      _id: category,
      "history.year": currentYear,
      "history.month": currentMonth,
      user: req.user._id,
    });

    let updatedCategory;

    if (categoryToUpdate) {
      // Update the existing history entry
      updatedCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        { $inc: { "history.$.earned": parsedAmount } },
        { new: true }
      );
    } else {
      // Add a new history entry
      const newHistoryEntry = {
        spent: 0,
        earned: parsedAmount,
        month: currentMonth,
        year: currentYear,
      };
      updatedCategory = await CategoryModel.findByIdAndUpdate(
        category,
        {
          $push: { history: newHistoryEntry },
        },
        { new: true }
      );
    }

    const newIncomeObject = await TransactionModel.create({
      name,
      description,
      category,
      isIncome: true,
      amount: parsedAmount,
      user: req.user._id,
    });

    const newIncome = await TransactionModel.findById(
      newIncomeObject._id
    ).populate("category");

    return res.status(201).json({ updatedUser, updatedCategory, newIncome });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-income/:id", getUserClerkId, async (req, res) => {
  try {
    const { name, amount, description, category } = req.body;
    const parsedAmount = parseFloat(amount);

    const incomeToUpdate = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(
      incomeToUpdate.category
    );
    const newCategory = await CategoryModel.findById(category);

    if (!incomeToUpdate || !categoryToUpdate || !newCategory) {
      return res.status(404).json({ error: "Income or category not found" });
    }

    const currentYear = new Date(incomeToUpdate.createdAt).getFullYear();
    const currentMonth = new Date(incomeToUpdate.createdAt).getMonth() + 1;

    const currentAmount = parseFloat(incomeToUpdate.amount);
    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserEarned = parseFloat(
      req.user.history.find(
        (e) =>
          e.year == new Date(incomeToUpdate.createdAt).getFullYear() &&
          e.month == new Date(incomeToUpdate.createdAt).getMonth() + 1
      ).earned
    );
    let updatedNewCategory;
    let updatedPrevCategory;

    let updatedUserInfo = {
      funds: currentUserFunds,
      earned: currentUserEarned,
    };

    if (incomeToUpdate.category == category) {
      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $inc: {
            "history.$.earned": parsedAmount - currentAmount,
          },
        },
        { new: true }
      );
      updatedPrevCategory = null;
    } else {
      // Decrement the earned amount from the previous category
      updatedPrevCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: incomeToUpdate.category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $inc: {
            "history.$.earned": -currentAmount,
          },
        },
        { new: true }
      );

      // Increment the earned amount for the new category
      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $inc: {
            "history.$.earned": parsedAmount,
          },
        },
        { new: true }
      );
    }

    // Update user funds and earned
    if (currentAmount > parsedAmount) {
      updatedUserInfo.funds -= currentAmount - parsedAmount;
      updatedUserInfo.earned -= currentAmount - parsedAmount;
    } else {
      updatedUserInfo.funds += parsedAmount - currentAmount;
      updatedUserInfo.earned += parsedAmount - currentAmount;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.year": currentYear,
        "history.month": currentMonth,
      },
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        "history.$.earned": Number.isFinite(updatedUserInfo.earned)
          ? updatedUserInfo.earned
          : currentUserEarned,
      },
      { new: true }
    );

    const newIncome = await TransactionModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        amount: parsedAmount,
      },
      { new: true }
    ).populate("category");

    return res.status(200).json({
      newIncome,
      updatedUser,
      updatedPrevCategory,
      updatedNewCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-expense/:id", getUserClerkId, async (req, res) => {
  try {
    const { name, amount, description, category } = req.body;
    const parsedAmount = parseFloat(amount);

    const expenseToUpdate = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(
      expenseToUpdate.category
    );
    const newCategory = await CategoryModel.findById(category);

    if (!expenseToUpdate || !categoryToUpdate || !newCategory) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    const currentAmount = parseFloat(expenseToUpdate.amount);
    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserSpent = parseFloat(
      req.user.history.find(
        (e) =>
          e.year == new Date(expenseToUpdate.createdAt).getFullYear() &&
          e.month == new Date(expenseToUpdate.createdAt).getMonth() + 1
      ).spent
    );
    let updatedNewCategory;
    let updatedPrevCategory;

    let updatedUserInfo = {
      funds: currentUserFunds,
      spent: currentUserSpent,
    };

    if (expenseToUpdate.category == category) {
      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $inc: {
            "history.$.spent": parsedAmount - currentAmount,
          },
        },
        { new: true }
      );
      updatedPrevCategory = null;
    } else {
      // Decrement the spent amount from the previous category
      updatedPrevCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: expenseToUpdate.category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $inc: {
            "history.$.spent": -currentAmount,
          },
        },
        { new: true }
      );

      // Increment the spent amount for the new category
      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $inc: {
            "history.$.spent": parsedAmount,
          },
        },
        { new: true }
      );
    }

    // Update user funds and spent
    if (currentAmount > parsedAmount) {
      updatedUserInfo.funds += currentAmount - parsedAmount;
      updatedUserInfo.spent -= currentAmount - parsedAmount;
    } else {
      updatedUserInfo.funds -= parsedAmount - currentAmount;
      updatedUserInfo.spent += parsedAmount - currentAmount;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
        "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
      },
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        "history.$.spent": Number.isFinite(updatedUserInfo.spent)
          ? updatedUserInfo.spent
          : currentUserSpent,
      },
      { new: true }
    );

    const newExpense = await TransactionModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        amount: parsedAmount,
      },
      { new: true }
    ).populate("category");

    return res.status(200).json({
      newExpense,
      updatedUser,
      updatedPrevCategory,
      updatedNewCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-expense/:id", getUserClerkId, async (req, res) => {
  try {
    const { amount, category } = req.body;
    const parsedAmount = parseFloat(amount);

    const expenseToDelete = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!expenseToDelete || !categoryToUpdate) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    const userSpentFromHistory = req.user.history.find(
      (e) =>
        e.month == new Date(expenseToDelete.createdAt).getMonth() + 1 &&
        new Date(expenseToDelete.createdAt).getFullYear() == e.year
    );

    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserSpent = parseFloat(userSpentFromHistory.spent);
    const currentCategorySpent = parseFloat(
      categoryToUpdate.history[categoryToUpdate.history.length - 1].spent
    );

    let updatedUserInfo = {
      funds: currentUserFunds,
      spent: currentUserSpent,
    };
    let updatedCategoryInfo = {
      spent: currentCategorySpent,
    };

    updatedUserInfo.funds += parsedAmount;
    updatedUserInfo.spent -= parsedAmount;
    updatedCategoryInfo.spent -= parsedAmount;

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.month": new Date(expenseToDelete.createdAt).getMonth() + 1,
        "history.year": new Date(expenseToDelete.createdAt).getFullYear(),
      },
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        "history.$.spent": Number.isFinite(updatedUserInfo.spent)
          ? updatedUserInfo.spent
          : currentUserSpent,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      {
        _id: category,
        "history.year": new Date(expenseToDelete.createdAt).getFullYear(),
        "history.month": new Date(expenseToDelete.createdAt).getMonth() + 1,
      },
      {
        "history.$.spent": Number.isFinite(updatedCategoryInfo.spent)
          ? updatedCategoryInfo.spent
          : currentCategorySpent,
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      newExpense: expenseToDelete,
      updatedUser,
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-income/:id", getUserClerkId, async (req, res) => {
  try {
    const { amount, category } = req.body;
    const parsedAmount = parseFloat(amount);

    const incomeToDelete = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!incomeToDelete || !categoryToUpdate) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    const userEarnedFromHistory = req.user.history.find(
      (e) =>
        e.month == new Date(incomeToDelete.createdAt).getMonth() + 1 &&
        new Date(incomeToDelete.createdAt).getFullYear() == e.year
    );

    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserEarned = parseFloat(userEarnedFromHistory.earned);
    const currentCategoryEarned = parseFloat(
      categoryToUpdate.history[categoryToUpdate.history.length - 1].earned
    );

    let updatedUserInfo = {
      funds: currentUserFunds,
      earned: currentUserEarned,
    };
    let updatedCategoryInfo = {
      earned: currentCategoryEarned,
    };

    updatedUserInfo.funds -= parsedAmount;
    updatedUserInfo.earned -= parsedAmount;
    updatedCategoryInfo.earned -= parsedAmount;

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.month": new Date(incomeToDelete.createdAt).getMonth() + 1,
        "history.year": new Date(incomeToDelete.createdAt).getFullYear(),
      },
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        "history.$.earned": Number.isFinite(updatedUserInfo.earned)
          ? updatedUserInfo.earned
          : currentUserEarned,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      {
        _id: category,
        "history.year": new Date(incomeToDelete.createdAt).getFullYear(),
        "history.month": new Date(incomeToDelete.createdAt).getMonth() + 1,
      },
      {
        "history.$.earned": Number.isFinite(updatedCategoryInfo.earned)
          ? updatedCategoryInfo.earned
          : currentCategoryEarned,
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      newIncome: incomeToDelete,
      updatedUser,
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
