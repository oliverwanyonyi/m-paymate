'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.createTable('budget_categories',{
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_amount_spent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    budget_id:{
      type:Sequelize.INTEGER,
      references:{
        model:"budgets",
        key:'id'
      },
      onDelete:'CASCADE'
    }
  })
  },

  async down (queryInterface, Sequelize) {
 await queryInterface.dropTable('budget_categories')
  }
};
