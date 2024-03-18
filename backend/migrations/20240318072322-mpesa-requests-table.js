"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mpesa_requests", {
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
          defaultValue: "initiated",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      
    });
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.dropTable('mpesa_requests')
  },
};
