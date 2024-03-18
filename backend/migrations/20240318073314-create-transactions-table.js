'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('transactions',{
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
    category:{
      type:Sequelize.INTEGER,
      references:{
        model:"budget_categories",
        key:'id'
      },
      allowNull:true
    },
    user_id:{
      type:Sequelize.INTEGER,
      references:{
        model:"users",
        key:'id'
      },
      allowNull:true 
    },
    transaction_date:{
      type:Sequelize.DATE,
      defaultValue:Sequelize.fn('NOW'),
      allowNull:false
    }
   })
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.dropTable('transactions')
  }
};
