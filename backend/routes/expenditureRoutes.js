const { body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const {
  expenditureAdd,
  getExpenditures,
  deleteExpenditure,
  updateExpenditure,
  getExpenditure,
} = require("../controllers/expenditure");
const router = require("express").Router();

router.route("/create").post(
  protect,

  body("name").trim().notEmpty().withMessage("Expenditure name is required"),
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
  body("category").isInt().withMessage("Budget Category Is required"),

  expenditureAdd
);

router.route("/all").get(protect, getExpenditures);

router.route("/:expeId").get(protect, getExpenditure);

router.route("/:expeId/delete").delete(protect, deleteExpenditure);

router.route("/:expeId/update").put(
  protect,
  body("name").trim().notEmpty().withMessage("Expenditure name is required"),
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
  updateExpenditure
);

module.exports = router;
