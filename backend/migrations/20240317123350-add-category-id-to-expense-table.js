"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "expenditures",
      "category_id",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'budget_categories',
          key: 'id'
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('expenditures', 'category_id');
  },
};
