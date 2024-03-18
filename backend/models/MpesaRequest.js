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
        type: DataTypes.DECIMAL(10, 2),
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
      checkout_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      merchat_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("initiated", "failed", "paid"),
        defaultValue: "initated",
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
