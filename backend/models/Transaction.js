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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: "budget_categories",
          key: "id",
        },
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
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
