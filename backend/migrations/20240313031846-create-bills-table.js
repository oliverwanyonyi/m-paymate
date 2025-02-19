'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    await queryInterface.createTable('bills',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expense: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      amount: {
        type: Sequelize.DOUBLE(10, 2), 
        allowNull: false
      },
      expense_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'expenditures',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete:"CASCADE"
      },
      // status:{
      //   type: Sequelize.ENUM(
      //     "pending",
      //     "partially-paid",
      //     "paid",
      //   ),
        
      //   defaultValue:'pending'
      // }, 
      balance: {
        type:Sequelize.DOUBLE(10,2),

      },
      due_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
