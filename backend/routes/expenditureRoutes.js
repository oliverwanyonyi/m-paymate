const { body } = require('express-validator')
const { protect } = require('../middlewares/authMiddleware')
const {expenditureAdd,getExpenditures} = require('../controllers/expenditure')
const router = require('express').Router()



router.route('/create').post(protect,
    
    body('name').trim().notEmpty().withMessage('Expenditure name is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1')
    , expenditureAdd)




    router.route('/all').get(protect, getExpenditures)






module.exports = router