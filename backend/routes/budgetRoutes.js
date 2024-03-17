const { body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const {
  createBudget,
  getBudgetCategories,
  getBudgets,
  getCategoriesByBudget,
  getCategoryDetails,
  updateBudgetCategory,
  deleteBudgetCategory,
  deleteBudget,
  addBudgetCategory,
} = require("../controllers/budgetController");

const router = require("express").Router();

const budgetValidationRule = [
  body("categories.*.name").notEmpty().withMessage("Category name is required"),
  body("categories.*.amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
];

const categoryValidationRule = [
    body("name").notEmpty().withMessage("Category name is required"),
    body("amount")
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),
]

router.route("/create").post(protect, budgetValidationRule, createBudget);

router.route("/categories").get(protect, getBudgetCategories);

router.route("/all").get(protect, getBudgets);

router.route("/:budgetId/categories").get(protect, getCategoriesByBudget);

router.route("/category/:cateId").get(protect, getCategoryDetails);

router
  .route("/category/:cateId/update")
  .put(
    protect,
    body("amount")
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),
    updateBudgetCategory
  );


  router.route('/category/:cateId/delete').delete(protect,deleteBudgetCategory)


  router.route('/:budgetId/delete', protect, deleteBudget)


  router.route('/:budgetId/category/add').post(protect, categoryValidationRule, addBudgetCategory)

module.exports = router;
