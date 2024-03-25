"use strict";

const Sequelize = require("sequelize");
const db = {};

require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, "root", "", {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
  port: 3306,
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Expenditure = require("./Expenditure")(sequelize, Sequelize);
db.Bill = require("./Bill")(sequelize, Sequelize);
db.Budget = require("./Budget")(sequelize, Sequelize);
db.BudgetCategory = require("./BudgetCategory")(sequelize, Sequelize);
db.MpesaRequest = require("./MpesaRequest")(sequelize, Sequelize);
db.Transaction = require("./Transaction")(sequelize, Sequelize);
db.Testimonial = require("./Testimonial")(sequelize, Sequelize);
db.User.hasMany(db.Expenditure, { foreignKey: "user_id" });
db.User.hasMany(db.Bill, { foreignKey: "user_id" });

db.Budget.hasMany(db.BudgetCategory, { foreignKey: "budget_id" });
db.BudgetCategory.belongsTo(db.Budget, { foreignKey: "budget_id" });

db.Expenditure.belongsTo(db.User, { foreignKey: "user_id" });
db.Bill.belongsTo(db.User, { foreignKey: "user_id" });

db.Bill.hasMany(db.Transaction, { foreignKey: "bill_id", as: "transactions" });
db.Transaction.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });

db.BudgetCategory.hasMany(db.Transaction, { foreignKey: "category" });
db.Transaction.belongsTo(db.BudgetCategory, { foreignKey: "category" });

module.exports = db;
