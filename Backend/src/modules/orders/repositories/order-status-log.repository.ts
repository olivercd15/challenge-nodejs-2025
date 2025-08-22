import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderStatusLogEntity } from '../entities/order-status-log.entity';

@Injectable()
export class OrderStatusLogRepository {
  constructor(
    @InjectModel(OrderStatusLogEntity)
    private readonly orderStatusLogModel: typeof OrderStatusLogEntity,
  ) {}

  async create(
    logData: Partial<OrderStatusLogEntity>,
  ): Promise<OrderStatusLogEntity> {
    return this.orderStatusLogModel.create(logData as any);
  }

  async findByOrderId(orderId: number): Promise<OrderStatusLogEntity[]> {
    return this.orderStatusLogModel.findAll({
      where: { order_id: orderId },
      order: [['created_at', 'DESC']],
    });
  }

  async deleteByOrderId(orderId: number): Promise<number> {
    return this.orderStatusLogModel.destroy({ where: { order_id: orderId } });
  }
}
