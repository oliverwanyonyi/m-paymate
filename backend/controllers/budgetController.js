const { validationResult } = require("express-validator");
const moment = require("moment/moment");
const { Budget, BudgetCategory } = require("../models");
const sequelize = require("sequelize");
const db = require("../models");
exports.createBudget = async (req, res, next) => {
  try {
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }

    const currentMonth = moment().format("MM");
    console.log(currentMonth);

    const currentYear = moment().format("YYYY");

    const startDate = moment(
      `${currentYear}-${currentMonth}-01`,
      "YYYY-MM-DD"
    ).toDate();
    const endDate = moment(startDate).endOf("month").toDate();

    const existingBudget = await Budget.findOne({
      where: {
        user_id: req.user.id,
        start_date: {
          [sequelize.Op.lte]: endDate,
        },
        end_date: {
          [sequelize.Op.gte]: startDate,
        },
      },
    });

    if (existingBudget) {
      return res
        .status(400)
        .json({ message: "Budget For This month already exists" });
    }

    const budget = new Budget({
      start_date: startDate,
      end_date: endDate,
      user_id: req.user.id,
    });
    await budget.save();

    const categoryPromises = req.body.categories.map((categoryItem) => {
      const category = new BudgetCategory({
        budget_id: budget.id,
        name: categoryItem.name,
        amount: categoryItem.amount,
      });
      return category.save();
    });

    await Promise.all(categoryPromises);

    res.send("Budget Created successfully");
  } catch (error) {
    next(error);
  }
};

exports.getBudgetCategories = async (req, res, next) => {
  try {
    const latestBudget = await Budget.findOne({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!latestBudget) {
      return res.status(404).json({ message: "No budget found" });
    }

    const categoryItems = await BudgetCategory.findAll({
      where: { budget_id: latestBudget.id },
    });

    res.json(categoryItems);
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesByBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: { user_id: req.user.id, id: req.params.budgetId },
    });

    if (!budget) {
      return res.status(404).json({ message: "No budget found" });
    }

    const categoryItems = await BudgetCategory.findAll({
      where: { budget_id: budget.id },
    });

    res.json(categoryItems);
  } catch (error) {
    next(error);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    const { rows: budgets, count } = await Budget.findAndCountAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return res.json({ pageCount: Math.ceil(count / perPage), budgets });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryDetails = async (req, res, next) => {
  try {
    const budget_categories = await BudgetCategory.findOne({
      where: {
        id: req.params.cateId,
      },
    });

    res.json(budget_categories);
  } catch (error) {
    next(error);
  }
};

exports.updateBudgetCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    await BudgetCategory.update(
      { ...req.body },
      {
        where: {
          id: req.params.cateId,
        },
      }
    );

    res.send("budget ctegory Updated");
  } catch (error) {
    next(error);
  }
};

exports.deleteBudgetCategory = async (req, res, next) => {
  try {
    const category = await BudgetCategory.findByPk(req.params.cateId);

    await category.destroy();

    res.send("category deletd");
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.budgetId,
        user_id: req.user.id,
      },
    });

    await budget.destroy();

    res.send("budget removed");
  } catch (error) {
    next(error);
  }
};

exports.addBudgetCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const budget = await Budget.findByPk(req.params.budgetId);
    if (!budget) {
      res.status(404).json("budget not found");
    }

    await BudgetCategory.create({
      ...req.body,
      budget_id: req.params.budgetId,
    });

    res.send("budget catgory added");
  } catch (error) {
    next(error);
  }
};

exports.dashboardAnalytics = async (req, res, next) => {
  try {
    const currentDate = moment().startOf("month");
    const endDate = moment().endOf("month");

    const budget = await db.Budget.findOne({
      where: {
        user_id: req.user.id,
        start_date: {
          [sequelize.Op.lte]: endDate,
        },
        end_date: {
          [sequelize.Op.gte]: currentDate,
        },
      },
      // include: [
      //   {
      //     model: db.BudgetCategory,

      //     include: [{ model: db.Transaction }],
      //   },
      // ],
      include: [
        {
          model: db.BudgetCategory,
          include: [
            {
              model: db.Transaction,
            },
          ],
        },
      ],
    });

    if (!budget) {
      throw new Error("No budget found for the current month.");
    }

    let totalBudget = 0;
    // let totalCategories = budget.budget_categories.length;
    let totalSpent = 0;

    budget.budget_categories.forEach((category) => {
      totalBudget += category.amount;
      totalSpent += category.total_amount_spent;
    });

    const remainingBudget = totalBudget - totalSpent;

    const bills = await db.Bill.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: db.Transaction,
          as: "transactions",
          attributes: ["amount"],
        },
      ],
    });

    let outgoingMoney = 0;
    bills.forEach((bill) => {
      let totalPaid = 0;
      bill.transactions.forEach((transaction) => {
        totalPaid += transaction.amount;
      });
      const balance = bill.amount - totalPaid;
      if (balance > 0) {
        outgoingMoney += balance;
      }
    });

    const pending_bills = await db.Bill.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: db.Transaction,
          as: "transactions",
        },
      ],
    });

    console.log(pending_bills);

    let total_bills_count = bills.length;
    let pendingBillsCount = 0;
    pending_bills.forEach((bill) => {
      let totalPaid = 0;
      bill.transactions.forEach((transaction) => {
        totalPaid += transaction.amount;
      });
      const balance = bill.amount - totalPaid;
      if (balance > 0) {
        pendingBillsCount++;
      }
    });

    res.json({
      totalBudget,
      total_bills_count,
      remainingBudget,
      totalSpent,
      outgoingMoney,
      pendingBillsCount,
      budget_categories:budget.budget_categories
    });
  } catch (error) {
    next(error);
  }
};
