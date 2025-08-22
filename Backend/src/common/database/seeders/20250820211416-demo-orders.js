'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const [orderResult] = await queryInterface.bulkInsert('orders', [
      {
        client_name: 'Juan Perez',
        total: 80,
        status: 'sent',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], { returning: ['id'] });

    await queryInterface.bulkInsert('order_items', [
      {
        order_id: orderResult.id,
        description: 'Lomo saltado',
        quantity: 1,
        total: 60,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: orderResult.id,
        description: 'Inka Kola',
        quantity: 2,
        total: 10,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('order_status_logs', [
      {
        order_id: orderResult.id,
        previous_status: 'created',
        new_status: 'initiated',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: orderResult.id,
        previous_status: 'initiated',
        new_status: 'sent',
        created_at: new Date(Date.now() + 5 * 60 * 1000),
        updated_at: new Date(Date.now() + 5 * 60 * 1000)
      }
    ], {});
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_status_logs', null, {});
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
};