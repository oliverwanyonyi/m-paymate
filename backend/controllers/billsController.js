const db = require("../models");
const Bill = db.Bill;
exports.createBill = async (req, res, next) => {
  try {
    const { bills } = req.body;
    const userId = req.user.id; // Get user's ID from authentication
    const billsWithUserId = bills.map((bill) => ({ ...bill, user_id: userId }));
    const createdBills = await Bill.bulkCreate(billsWithUserId);
    res.status(201).send("bills created successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getBills = async function (req, res, next) {
  try {
    const { page = 1, perPage = 8 } = req.query;

    const { rows: bills, count } = await db.Bill.findAndCountAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return res.json({ pageCount: Math.ceil(count / perPage), bills });
  } catch (error) {
    next(error);
  }
};

exports.deleteBill = async function(req, res, next) {
  try {
    await db.Bill.destroy({ where: { id: req.params.billId } });
    res.send('Bill deleted')
  } catch (error) {
    next(error);
  }
}


