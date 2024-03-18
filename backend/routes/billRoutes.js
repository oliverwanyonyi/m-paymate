const { createBill, getBills, deleteBill, payBill } = require('../controllers/billsController')
const { protect } = require('../middlewares/authMiddleware')
const { getAuthToken } = require('../middlewares/getAuthToken')

const router = require('express').Router()




router.route('/create').post(protect, createBill)

router.route('/all').get(protect, getBills)

router.route('/:billId/delete').delete(deleteBill)


router.route('/:billId/payBill').post(protect,getAuthToken, payBill)

router.route('/payment/callback').post((req,res,next)=>{
    console.log(req.body);
})
module.exports = router