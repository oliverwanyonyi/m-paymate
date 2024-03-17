const { validationResult } = require("express-validator");
const moment = require("moment/moment");
const { Budget, BudgetCategory } = require("../models");
const sequelize = require("sequelize");
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
  } catch (error) {
    next(error);
  }
};

exports.addBudgetCategory = async (req, rex, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const budget = await Budget.findByPk(req.params.budgetId);
    if (!budget) {
      res.status(404).json("budget not found");
    }

    await BudgetCategory.create(req.body);

    res.send("budget catgory added");
  } catch (error) {
    next(error);
  }
};
