const db = require("../models");
const Bill = db.Bill
exports.createBill = async(req,res,next)=>{
    try {

        const { bills } = req.body;
        const userId = req.user.id; // Get user's ID from authentication
        const billsWithUserId = bills.map(bill => ({ ...bill, user_id: userId }));
        const createdBills = await Bill.bulkCreate(billsWithUserId);
        res.status(201).send('bills created successfully');
        
    } catch (error) {
        console.log(error);
        next(error)
    }
}



exports.getBills  = async function (req,res,next) {

    try {

        const {page = 1, perPage =7} = req.query

      

        const {rows:bills, count} =await Expenditure.findAndCountAll({where:{
            user_id:req.user.id
        },
        order: [["createdAt", "DESC"]],
          offset: (page - 1) * perPage,
          limit: perPage,
    
    })
        

    return res.json({ pageCount: Math.ceil(count / perPage), expenditures });
    } catch (error) {
        next(error)
    }
}