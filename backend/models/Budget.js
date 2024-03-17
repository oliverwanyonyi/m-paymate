const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const budget = sequelize.define("budgets", {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'users',
        key:'id'
      },
      onDelete:'CASCADE'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },{tableName:'budgets'});

  return budget;
};
