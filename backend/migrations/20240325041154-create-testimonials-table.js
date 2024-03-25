'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('testimonials',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
      },
     rating: {
      type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      }, 
      description:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_id:{
        type:Sequelize.INTEGER,
        references:{
          model:"users",
          key:'id'
        },
        allowNull:true ,
        onDelete:"SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('testimonials')
  }
};
