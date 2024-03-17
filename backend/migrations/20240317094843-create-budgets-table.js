'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('budgets', {
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
          allowNull: false,
          type: Sequelize.DATE
        },
       end_date: {
          allowNull: false,
          type: Sequelize.DATE
        }
,
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
   await queryInterface.dropTable("budgets")
  }
};
