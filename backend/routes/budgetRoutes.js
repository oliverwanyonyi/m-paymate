const {  body } = require('express-validator')
const { protect } = require('../middlewares/authMiddleware')
const { createBudget, getBudgetCategories, getBudgets, getCategoriesByBudget, getCategoryDetails } = require('../controllers/budgetController')

const router  = require('express').Router()


const budgetValidationRule = [

    body('categories.*.name').notEmpty().withMessage('Category name is required'),
    body('categories.*.amount').isNumeric().withMessage('Amount must be a number').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
]

router.route('/create').post(protect,budgetValidationRule,createBudget)


router.route('/categories').get(protect,getBudgetCategories)

router.route('/all').get(protect, getBudgets)

router.route('/:budgetId/categories').get(protect, getCategoriesByBudget)

router.route('/category/:categoryId').get(protect, getCategoryDetails)


module.exports = router