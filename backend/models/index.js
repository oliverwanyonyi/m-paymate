'use strict';

const Sequelize = require('sequelize')
const db = {};

const sequelize = new Sequelize("m-paymete-db","root","",{
    host: "localhost",
    dialect: "mysql",
    logging: false,
    port:3306
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize,Sequelize)
db.Expenditure = require('./Expenditure')(sequelize,Sequelize)
db.Bill = require('./Bill')(sequelize,Sequelize)
db.Budget = require('./Budget')(sequelize,Sequelize)
db.BudgetCategory = require('./BudgetCategory')(sequelize,Sequelize)

db.User.hasMany(db.Expenditure, {foreignKey:'user_id'})
db.User.hasMany(db.Bill, {foreignKey:'user_id'})

db.Expenditure.belongsTo(db.User, {foreignKey:'user_id'})
db.Bill.belongsTo(db.User, {foreignKey:'user_id'})

module.exports = db;