const { createBill, getBills, deleteBill } = require('../controllers/billsController')
const { protect } = require('../middlewares/authMiddleware')

const router = require('express').Router()



router.route('/create').post(protect, createBill)

router.route('/all').get(protect, getBills)

router.route('/:billId/delete').delete(deleteBill)


router.route('/:billId/payBill', protect, )
module.exports = router