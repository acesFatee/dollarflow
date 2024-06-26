const express = require("express");
const router = express.Router();
const TransactionModel = require("../models/TransactionModel");
const getUserClerkId = require("../middlewares/getUserClerkId");
const UserModel = require("../models/UserModel");
const CategoryModel = require("../models/CategoryModel");

router.get("/", getUserClerkId, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const filter = req.query.filter;

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
    }

    if (req.query.seach !== "") {
      const regexp = new RegExp(req.query.search, "i");
      query.name = regexp;
    }

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
    console.log(req.body)
    const parsedAmount = Number(amount);

    const categoryForExpense = await CategoryModel.findById(category);
    if (!categoryForExpense) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const user = req.user;
    if (user.funds < parsedAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }
    const totalSpendOnCategory = parsedAmount + categoryForExpense.spent;

    const updatedUserFunds = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $inc: { spent: parsedAmount, funds: -parsedAmount },
      },
      { new: true }
    );

    const updatedCategoryAmount = await CategoryModel.findByIdAndUpdate(
      category,
      { $inc: { spent: amount } },
      { new: true }
    );

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

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          funds: amount,
          earned: amount,
        },
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      category,
      { $inc: { earned: amount } },
      { new: true }
    );

    const newIncomeObject = await TransactionModel.create({
      name,
      description,
      category,
      isIncome: true,
      amount,
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
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!incomeToUpdate || !categoryToUpdate) {
      return res.status(404).json({ error: "Income or category not found" });
    }

    const currentAmount = parseFloat(incomeToUpdate.amount);
    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserEarned = parseFloat(req.user.earned);
    const currentCategoryEarned = parseFloat(categoryToUpdate.earned);

    let updatedUserInfo = {
      funds: currentUserFunds,
      earned: currentUserEarned,
    };
    let updatedCategoryInfo = {
      earned: currentCategoryEarned,
    };

    if (currentAmount > parsedAmount) {
      updatedUserInfo.funds -= currentAmount - parsedAmount;
      updatedUserInfo.earned -= updatedUserInfo.earned - parsedAmount;
      updatedCategoryInfo.earned -= updatedCategoryInfo.earned - parsedAmount;
    } else {
      updatedUserInfo.funds += parsedAmount - currentAmount;
      updatedUserInfo.earned += parsedAmount - updatedUserInfo.earned;
      updatedCategoryInfo.earned += parsedAmount - updatedCategoryInfo.earned;
    }

    console.log(updatedUserInfo);
    console.log(updatedCategoryInfo);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        earned: Number.isFinite(updatedUserInfo.earned)
          ? updatedUserInfo.earned
          : currentUserEarned,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      category,
      {
        earned: Number.isFinite(updatedCategoryInfo.earned)
          ? updatedCategoryInfo.earned
          : currentCategoryEarned,
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
      updatedCategory,
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
    const categoryToUpdate = await CategoryModel.findById(category);

    if (!expenseToUpdate || !categoryToUpdate) {
      return res.status(404).json({ error: "Expense or category not found" });
    }

    const currentAmount = parseFloat(expenseToUpdate.amount);
    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserSpent = parseFloat(req.user.spent);
    const currentCategorySpent = parseFloat(categoryToUpdate.spent);

    let updatedUserInfo = {
      funds: currentUserFunds,
      spent: currentUserSpent,
    };
    let updatedCategoryInfo = {
      spent: currentCategorySpent,
    };

    if (currentAmount > parsedAmount) {
      updatedUserInfo.funds += currentAmount - parsedAmount;
      updatedUserInfo.spent -= currentAmount - parsedAmount
      updatedCategoryInfo.spent -= updatedCategoryInfo.spent - parsedAmount;
    } else {
      updatedUserInfo.funds -= parsedAmount - currentAmount;
      updatedUserInfo.spent += parsedAmount - categoryToUpdate.spent;
      updatedCategoryInfo.spent += parsedAmount - updatedCategoryInfo.spent;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        spent: Number.isFinite(updatedUserInfo.spent)
          ? updatedUserInfo.spent
          : currentUserSpent,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      category,
      {
        spent: Number.isFinite(updatedCategoryInfo.spent)
          ? updatedCategoryInfo.spent
          : currentCategorySpent,
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
      updatedCategory,
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

    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserSpent = parseFloat(req.user.spent);
    const currentCategorySpent = parseFloat(categoryToUpdate.spent);

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

    console.log(updatedUserInfo);
    console.log(updatedCategoryInfo);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        spent: Number.isFinite(updatedUserInfo.spent)
          ? updatedUserInfo.spent
          : currentUserSpent,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      category,
      {
        spent: Number.isFinite(updatedCategoryInfo.spent)
          ? updatedCategoryInfo.spent
          : currentCategorySpent,
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id)

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

    const currentUserFunds = parseFloat(req.user.funds);
    const currentUserEarned = parseFloat(req.user.earned);
    const currentCategoryEarned = parseFloat(categoryToUpdate.earned);

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

    console.log(updatedUserInfo);
    console.log(updatedCategoryInfo);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        funds: Number.isFinite(updatedUserInfo.funds)
          ? updatedUserInfo.funds
          : currentUserFunds,
        earned: Number.isFinite(updatedUserInfo.earned)
          ? updatedUserInfo.earned
          : currentUserEarned,
      },
      { new: true }
    );

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      category,
      {
        earned: Number.isFinite(updatedCategoryInfo.earned)
          ? updatedCategoryInfo.earned
          : currentCategoryEarned,
      },
      { new: true }
    );

    await TransactionModel.findByIdAndDelete(req.params.id)

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
