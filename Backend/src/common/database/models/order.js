'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
        });
        Order.hasMany(models.OrderStatusLog, {
            foreignKey: 'order_id',
        });
    }
  }
  
  Order.init({
    client_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'initiated'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true
  });
  
  return Order;
};