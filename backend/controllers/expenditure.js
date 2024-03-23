const {validationResult}  = require("express-validator")
const { Expenditure } = require("../models")

async function expenditureAdd(req,res,next ){


    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json(errors)
        }

        await Expenditure.create({...req.body,category_id:req.body.category ,user_id:req.user.id})


        res.send("Expenditure added")
    } catch (error) {
        console.log(error);
        next(error)
    }
}


async function getExpenditures(req,res,next) {

    try {

        const {page = 1, perPage =7} = req.query

        if(page === 'all'){
            const expenditures =await Expenditure.findAll({where:{
                user_id:req.user.id
            },})

            return res.json(expenditures)
        }

        const {rows:expenditures, count} =await Expenditure.findAndCountAll({where:{
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



async function deleteExpenditure(req,res,next) {

    try {
        await Expenditure.destroy({where:{
            id:req.params.expeId
        }})

        res.send('Expenditure removed')
    } catch (error) {
        next(error)
    }
}



async function updateExpenditure(req,res,next){
      try {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json(errors)
        }
        await Expenditure.update({...req.body},{where:{id:req.params.expeId}})

        res.send('expense updated')
        
      } catch (error) {
        next(error)
      }
}

const getExpenditure = async (req,res,next) =>{
    try {

        const expenditure = await Expenditure.findOne({where:{
            user_id:req.user.id,
            id:req.params.expeId
        }})
        
        res.json(expenditure)
    } catch (error) {
        next(error)
    }
}


module.exports = {expenditureAdd,getExpenditures, updateExpenditure,deleteExpenditure,getExpenditure}