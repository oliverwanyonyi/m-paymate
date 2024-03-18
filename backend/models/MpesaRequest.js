const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const mpesa_request = sequelize.define(
    "mpesa_request",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
      },
      account_reference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      mpesa_receipt_no:{
        allowNull:true,
        type:Sequelize.STRING
      },
      checkout_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      merchat_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expense_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "expenditures",
          key: "id",
        },
      },
      bill_id:{
        type: Sequelize.INTEGER,
        references: {
          model: "bills",
          key: "id",
        },
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("initiated", "failed", "paid"),
        defaultValue: "initiated",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    { tableName: "mpesa_requests" }
  );

  return mpesa_request;
};
