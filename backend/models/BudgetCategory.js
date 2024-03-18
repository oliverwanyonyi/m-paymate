const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const budget_category = sequelize.define(
    "budget_category",
    {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type:DataTypes.INTEGER
        },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
      },
      total_amount_spent: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      budget_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "budgets",
          key: "id",
        },
        onDelete:"CASCADE"
      },
    },
    { tableName: "budget_categories", timestamps: false }
  );

  return budget_category;
};
