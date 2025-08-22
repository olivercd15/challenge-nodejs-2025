import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(OrderItemEntity)
    private readonly orderItemModel: typeof OrderItemEntity,
  ) {}

  async createMany(
    items: Partial<OrderItemEntity>[],
  ): Promise<OrderItemEntity[]> {
    return this.orderItemModel.bulkCreate(items as any);
  }

  async findByOrderId(orderId: number): Promise<OrderItemEntity[]> {
    return this.orderItemModel.findAll({ where: { order_id: orderId } });
  }

  async deleteByOrderId(orderId: number): Promise<number> {
    return this.orderItemModel.destroy({ where: { order_id: orderId } });
  }
}
