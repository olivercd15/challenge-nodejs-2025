
'use strict';
const bcrypt = require('bcrypt'); 


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('12341234', 10);
    await queryInterface.bulkInsert('users', [
      { name: 'Admin Oliver', email: 'admin@test.com', password: hashedPassword, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
