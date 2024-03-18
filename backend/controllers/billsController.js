const { getAuthToken } = require("../middlewares/getAuthToken");
const db = require("../models");
const axios =require('axios')
const Bill = db.Bill;
const { generateTimestamp } = require("../utils/generateTimestamp");
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

exports.deleteBill = async function (req, res, next) {
  try {
    await db.Bill.destroy({ where: { id: req.params.billId } });
    res.send("Bill deleted");
  } catch (error) {
    next(error);
  }
};

exports.payBill = async (req, res, next) => {
  try {
    let{ amount, phone, tillNumber, businessNumber, accountNumber } =
      req.body;
    const paymentMethod = req.body.paymentMethod;

    const token = req.token;
    const auth = "Bearer " + token;

    let bs_short_code,
      phoneNumber,
      transaction_type,
      transaction_desc,
      callBackUrl, url;
    callBackUrl =
      "https://0d5f-102-212-236-135.ngrok-free.app/payment/callback";
    phoneNumber = "254" + phone.slice(1);

    url = process.env.lipa_na_mpesa_url
    let timestamp = require("../utils/generateTimestamp")();
    const pass_key = process.env.pass_key;

    console.log(timestamp,bs_short_code, pass_key);

    
    transaction_desc = `Account ${phone} Paying for their bills`;
    if (paymentMethod === "till") {
      bs_short_code = tillNumber;
      accountNumber = "Pay Bill Online";
      transaction_type = "CustomerBuyGoodsOnline";
      
    } else {
      bs_short_code = businessNumber;
      accountNumber = accountNumber;
      transaction_type = "CustomerPayBillOnline";
    }

    const password = Buffer.from(`${bs_short_code}${pass_key}${timestamp}`).toString("base64");



    const requestData = {
      BusinessShortCode: bs_short_code,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transaction_type,
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: bs_short_code,
      PhoneNumber: phoneNumber,
      CallBackURL: callBackUrl,
      AccountReference: accountNumber,
      TransactionDesc: transaction_desc,
    };
console.log(requestData);
    try {
      const { data } = await axios.post(url, requestData, {
        headers: {
          Authorization: auth,
        },
      });

     
  

      return res.send({
        success: true,
        message: data,
      });
    } catch (error) {
     
      return res.status(400).send({
        success: false,
        message: error.response?.data?.errorMessage,
      });
    }
  } catch (error) {
    next(error);
  }
};
