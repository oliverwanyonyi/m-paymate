const {
  createBill,
  getBills,
  deleteBill,
  payBill,
  recordOfflinePayment,
} = require("../controllers/billsController");
const { protect } = require("../middlewares/authMiddleware");
const { getAuthToken } = require("../middlewares/getAuthToken");
const { Expenditure, BudgetCategory } = require("../models");

const router = require("express").Router();

router.route("/create").post(protect, createBill);

router.route("/all").get(protect, getBills);

router.route("/:billId/delete").delete(deleteBill);

router.route("/:billId/payBill").post(protect, getAuthToken, payBill);

router.route("/payment/callback").post(async (req, res, next) => {
  const { Body } = req.body;
  const { stkCallback } = Body;

  if (stkCallback.ResultCode === 0) {
    // Successful transaction
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    try {
      const mpesaRequest = await db.MpesaRequest.findOne({
        where: {
          checkout_request_id: CheckoutRequestID,
          merchat_request_id: MerchantRequestID,
        },
      });

      if (mpesaRequest) {
        await mpesaRequest.update({ status: "paid" });

        const { Item } = CallbackMetadata;
        const amount = Item.find((item) => item.Name === "Amount").Value;
        const transactionDate = Item.find(
          (item) => item.Name === "TransactionDate"
        ).Value;

        const expenditure = await Expenditure.findByPk(mpesaRequest.expeId);

        if (expenditure) {
          budget_category = await BudgetCategory.findOne({
            where: { id: expenditure.category },
          });

          budget_category.total_amount_spent += amount

          await budget_category.save()

          await db.Transaction.create({
            amount,
            user_id: mpesaRequest.user_id,
            transaction_date: new Date(transactionDate),
            category:budget_category.id,
            bill_id:mpesaRequest.bill_id
          });
        }

       
      }
    } catch (error) {
      console.error("Error processing callback:", error);
    }
  } else {
    const mpesaRequest = await db.MpesaRequest.findOne({
      where: {
        checkout_request_id: CheckoutRequestID,
        merchat_request_id: MerchantRequestID,
      },
    });

    mpesaRequest.status = "failed";

    await mpesaRequest.save();
  }

  res.status(200).send();
});


router.route('/:billId/payment/record').post(protect, recordOfflinePayment)
module.exports = router;
