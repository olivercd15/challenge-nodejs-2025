import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderEntity } from '../entities/order.entity';
import { Op, Transaction } from 'sequelize';
import { OrderStatusLogEntity } from '../entities/order-status-log.entity';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderEntity)
    private readonly orderModel: typeof OrderEntity,
  ) {}

  async findAllExceptDelivered(): Promise<OrderEntity[]> {
    return this.orderModel.findAll({
      where: {
        status: { [Op.ne]: 'delivered' },
      },
      order: [['created_at', 'DESC']],
    });
  }

  async findById(
    id: number,
    includeRelations: boolean = true,
  ): Promise<OrderEntity | null> {
    const options: any = {};
    if (includeRelations) {
      options.include = [OrderItemEntity, OrderStatusLogEntity];
    }
    return this.orderModel.findByPk(id, options);
  }

  async create(orderData: Partial<OrderEntity>): Promise<OrderEntity> {
    return this.orderModel.create(orderData as any);
  }

  async update(id: number, updates: Partial<OrderEntity>): Promise<[number]> {
    return this.orderModel.update(updates, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return this.orderModel.destroy({ where: { id } });
  }

  async findByStatus(status: string): Promise<OrderEntity[]> {
    return this.orderModel.findAll({ where: { status } });
  }
}
