const express = require("express");
const router = express.Router();
const TransactionModel = require("../models/TransactionModel");
const getUserClerkId = require("../middlewares/getUserClerkId");
const UserModel = require("../models/UserModel");
const CategoryModel = require("../models/CategoryModel");
const mongoose = require("mongoose");
const moneyMath = require('money-math');

function toMoneyString(value) {
  if (typeof value === 'number') {
    return value.toFixed(2);
  } else if (typeof value === 'string') {
    return parseFloat(value).toFixed(2);
  } else {
    throw new TypeError('Value must be a number or a string');
  }
}

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
    const parsedAmount = toMoneyString(amount);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const categoryForExpense = await CategoryModel.findById(category);
    if (!categoryForExpense) {
      return res.status(400).json({ error: "Invalid category" });
    }

    await CategoryModel.findByIdAndUpdate(
      category,
      { $inc: { transactionCount: 1 } },
    );

    const user = req.user;
    const userFunds = toMoneyString(user.funds);

    let updatedUserFunds;

    const userToUpdate = await UserModel.findOne({
      _id: user._id,
      "history.year": currentYear,
      "history.month": currentMonth,
    });

    if (userToUpdate) {
      const currentSpent = toMoneyString(userToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).spent);

      const newSpent = moneyMath.add(currentSpent, parsedAmount);
      const newFunds = moneyMath.subtract(userFunds, parsedAmount);

      updatedUserFunds = await UserModel.findOneAndUpdate(
        {
          _id: user._id,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $set: { "history.$.spent": newSpent, funds: newFunds },
        },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: parsedAmount,
        earned: toMoneyString(0),
        month: currentMonth,
        year: currentYear,
      };
      updatedUserFunds = await UserModel.findByIdAndUpdate(
        user._id,
        { $push: { history: newHistoryEntry } },
        { new: true }
      );
    }

    let updatedCategoryAmount;

    const categoryToUpdate = await CategoryModel.findOne({
      _id: category,
      "history.year": currentYear,
      "history.month": currentMonth,
      user: req.user._id,
    });

    if (categoryToUpdate) {
      const currentCategorySpent = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).spent);

      const newCategorySpent = moneyMath.add(currentCategorySpent, parsedAmount);

      updatedCategoryAmount = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        { $set: { "history.$.spent": newCategorySpent } },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: parsedAmount,
        earned: toMoneyString(0),
        month: currentMonth,
        year: currentYear,
      };
      updatedCategoryAmount = await CategoryModel.findByIdAndUpdate(
        category,
        { $push: { history: newHistoryEntry } },
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

    const newExpense = await TransactionModel.findById(newExpenseObject._id).populate("category");

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
    const parsedAmount = toMoneyString(amount);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let updatedUser;

    const userToUpdate = await UserModel.findOne({
      _id: req.user._id,
      "history.year": currentYear,
      "history.month": currentMonth,
    });

    await CategoryModel.findByIdAndUpdate(category, {
      $inc: { transactionCount: 1 },
    });

    if (userToUpdate) {
      const userFunds = toMoneyString(userToUpdate.funds);
      const currentEarned = toMoneyString(userToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).earned);

      const newEarned = moneyMath.add(currentEarned, parsedAmount);
      const newFunds = moneyMath.add(userFunds, parsedAmount);

      console.log({
        newEarned,
        currentEarned
      })

      updatedUser = await UserModel.findOneAndUpdate(
        {
          _id: req.user._id,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $set: { "history.$.earned": newEarned, funds: newFunds },
        },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: toMoneyString(0),
        earned: parsedAmount,
        month: currentMonth,
        year: currentYear,
      };
      updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $push: { history: newHistoryEntry },
          $set: { funds: parsedAmount }, // Setting funds to parsedAmount as initial funds
        },
        { new: true }
      );
    }

    const categoryToUpdate = await CategoryModel.findOne({
      _id: category,
      "history.year": currentYear,
      "history.month": currentMonth,
      user: req.user._id,
    });

    let updatedCategory;

    if (categoryToUpdate) {
      const currentCategoryEarned = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).earned);

      const newCategoryEarned = moneyMath.add(currentCategoryEarned, parsedAmount);

      updatedCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        { $set: { "history.$.earned": newCategoryEarned } },
        { new: true }
      );
    } else {
      const newHistoryEntry = {
        spent: toMoneyString(0),
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
    const parsedAmount = toMoneyString(amount);

    const incomeToUpdate = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(incomeToUpdate.category);
    const newCategory = await CategoryModel.findById(category);

    if (!incomeToUpdate || !categoryToUpdate || !newCategory) {
      return res.status(404).json({ error: "Income or category not found" });
    }

    const currentYear = new Date(incomeToUpdate.createdAt).getFullYear();
    const currentMonth = new Date(incomeToUpdate.createdAt).getMonth() + 1;

    const currentAmount = toMoneyString(incomeToUpdate.amount);
    const currentUserFunds = toMoneyString(req.user.funds);
    const currentUserEarned = toMoneyString(
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
      const currentCategoryEarned = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).earned);

      const newCategoryEarned = moneyMath.add(currentCategoryEarned, moneyMath.subtract(parsedAmount, currentAmount));

      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $set: { "history.$.earned": newCategoryEarned },
        },
        { new: true }
      );
      updatedPrevCategory = null;
    } else {
      const prevCategoryEarned = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).earned);

      const newCategoryEarned = toMoneyString(newCategory.history.find(
        entry => entry.year === currentYear && entry.month === currentMonth
      ).earned);

      const updatedPrevCategoryEarned = moneyMath.subtract(prevCategoryEarned, currentAmount);
      const updatedNewCategoryEarned = moneyMath.add(newCategoryEarned, parsedAmount);

      updatedPrevCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: incomeToUpdate.category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $set: { "history.$.earned": updatedPrevCategoryEarned },
        },
        { new: true }
      );

      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": currentYear,
          "history.month": currentMonth,
        },
        {
          $set: { "history.$.earned": updatedNewCategoryEarned },
        },
        { new: true }
      );
    }

    // Update user funds and earned
    const diff = moneyMath.subtract(parsedAmount, currentAmount);
    updatedUserInfo.funds = moneyMath.add(currentUserFunds, diff);
    updatedUserInfo.earned = moneyMath.add(currentUserEarned, diff);

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.year": currentYear,
        "history.month": currentMonth,
      },
      {
        $set: { funds: updatedUserInfo.funds, "history.$.earned": updatedUserInfo.earned },
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
    const parsedAmount = toMoneyString(amount);

    const expenseToUpdate = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(expenseToUpdate.category);
    const newCategory = await CategoryModel.findById(category);

    if (!expenseToUpdate || !categoryToUpdate || !newCategory) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    const currentAmount = toMoneyString(expenseToUpdate.amount);
    const currentUserFunds = toMoneyString(req.user.funds);
    const currentUserSpent = toMoneyString(
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
      const currentCategorySpent = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === new Date(expenseToUpdate.createdAt).getFullYear() &&
                 entry.month === new Date(expenseToUpdate.createdAt).getMonth() + 1
      ).spent);

      const newCategorySpent = moneyMath.add(currentCategorySpent, moneyMath.subtract(parsedAmount, currentAmount));

      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $set: { "history.$.spent": newCategorySpent },
        },
        { new: true }
      );
      updatedPrevCategory = null;
    } else {
      const prevCategorySpent = toMoneyString(categoryToUpdate.history.find(
        entry => entry.year === new Date(expenseToUpdate.createdAt).getFullYear() &&
                 entry.month === new Date(expenseToUpdate.createdAt).getMonth() + 1
      ).spent);

      const newCategorySpent = toMoneyString(newCategory.history.find(
        entry => entry.year === new Date(expenseToUpdate.createdAt).getFullYear() &&
                 entry.month === new Date(expenseToUpdate.createdAt).getMonth() + 1
      ).spent);

      const updatedPrevCategorySpent = moneyMath.subtract(prevCategorySpent, currentAmount);
      const updatedNewCategorySpent = moneyMath.add(newCategorySpent, parsedAmount);

      updatedPrevCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: expenseToUpdate.category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $set: { "history.$.spent": updatedPrevCategorySpent },
        },
        { new: true }
      );

      updatedNewCategory = await CategoryModel.findOneAndUpdate(
        {
          _id: category,
          "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
          "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
        },
        {
          $set: { "history.$.spent": updatedNewCategorySpent },
        },
        { new: true }
      );
    }

    // Update user funds and spent
    const diff = moneyMath.subtract(parsedAmount, currentAmount);
    updatedUserInfo.funds = moneyMath.subtract(currentUserFunds, diff);
    updatedUserInfo.spent = moneyMath.add(currentUserSpent, diff);

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.year": new Date(expenseToUpdate.createdAt).getFullYear(),
        "history.month": new Date(expenseToUpdate.createdAt).getMonth() + 1,
      },
      {
        $set: { funds: updatedUserInfo.funds, "history.$.spent": updatedUserInfo.spent },
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
    const parsedAmount = toMoneyString(amount);

    const expenseToDelete = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!expenseToDelete || !categoryToUpdate) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    await CategoryModel.findByIdAndUpdate(category, {
      $inc: { transactionCount: -1 },
    });

    const userSpentFromHistory = req.user.history.find(
      (e) =>
        e.month == new Date(expenseToDelete.createdAt).getMonth() + 1 &&
        new Date(expenseToDelete.createdAt).getFullYear() == e.year
    );

    const currentUserFunds = toMoneyString(req.user.funds);
    const currentUserSpent = toMoneyString(userSpentFromHistory.spent);
    const currentCategorySpent = toMoneyString(
      categoryToUpdate.history[categoryToUpdate.history.length - 1].spent
    );

    let updatedUserInfo = {
      funds: moneyMath.add(currentUserFunds, parsedAmount),
      spent: moneyMath.subtract(currentUserSpent, parsedAmount),
    };
    let updatedCategoryInfo = {
      spent: moneyMath.subtract(currentCategorySpent, parsedAmount),
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.month": new Date(expenseToDelete.createdAt).getMonth() + 1,
        "history.year": new Date(expenseToDelete.createdAt).getFullYear(),
      },
      {
        $set: {
          funds: updatedUserInfo.funds,
          "history.$.spent": updatedUserInfo.spent,
        },
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
        $set: { "history.$.spent": updatedCategoryInfo.spent },
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      deletedExpense: expenseToDelete,
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
    const parsedAmount = toMoneyString(amount);

    const incomeToDelete = await TransactionModel.findById(req.params.id);
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!incomeToDelete || !categoryToUpdate) {
      return res.status(404).json({ error: "Income or category not found" });
    }

    await CategoryModel.findByIdAndUpdate(category, {
      $inc: { transactionCount: -1 },
    });

    const userEarnedFromHistory = req.user.history.find(
      (e) =>
        e.month == new Date(incomeToDelete.createdAt).getMonth() + 1 &&
        new Date(incomeToDelete.createdAt).getFullYear() == e.year
    );

    const currentUserFunds = toMoneyString(req.user.funds);
    const currentUserEarned = toMoneyString(userEarnedFromHistory.earned);
    const currentCategoryEarned = toMoneyString(
      categoryToUpdate.history[categoryToUpdate.history.length - 1].earned
    );

    let updatedUserInfo = {
      funds: moneyMath.subtract(currentUserFunds, parsedAmount),
      earned: moneyMath.subtract(currentUserEarned, parsedAmount),
    };
    let updatedCategoryInfo = {
      earned: moneyMath.subtract(currentCategoryEarned, parsedAmount),
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
        "history.month": new Date(incomeToDelete.createdAt).getMonth() + 1,
        "history.year": new Date(incomeToDelete.createdAt).getFullYear(),
      },
      {
        $set: {
          funds: updatedUserInfo.funds,
          "history.$.earned": updatedUserInfo.earned,
        },
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
        $set: { "history.$.earned": updatedCategoryInfo.earned },
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      deletedIncome: incomeToDelete,
      updatedUser,
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
