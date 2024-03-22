const { DataTypes } = require("sequelize");


module.exports = (sequelize, Sequelize) => {
  const transaction = sequelize.define(
    "transaction",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: "budget_categories",
          key: "id",
        },
        allowNull: true,
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete:"CASCADE"
      },
      bill_id:{
        type: Sequelize.INTEGER,
        references: {
          model: "bills",
          key: "id",
        },
        allowNull: true,
        onDelete: 'SET NULL'
      },
      mpesa_receipt_no:{
        allowNull:true,
        type:Sequelize.STRING
      },
      transaction_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
        allowNull: false,
      },
    },
    { tableName: "transactions", timestamps: false }
  );

  return transaction
};
