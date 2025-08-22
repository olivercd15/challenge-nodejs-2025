
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_name: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_status_logs');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('users');
  }
};
