"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed admin user
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin",
          username: "admin",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("12345678", 10),
          active: true,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove admin user
    await queryInterface.bulkDelete("users", { username: "admin" }, {});
  },
};
