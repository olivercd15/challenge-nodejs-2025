import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderStatusLogEntity } from '../entities/order-status-log.entity';
import { Op } from 'sequelize';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(
    @InjectModel(OrderEntity)
    private readonly orderModel: typeof OrderEntity,

    @InjectModel(OrderItemEntity)
    private readonly orderItemModel: typeof OrderItemEntity,

    @InjectModel(OrderStatusLogEntity)
    private readonly orderStatusLogModel: typeof OrderStatusLogEntity,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanupOldOrders() {
    this.logger.log('Initializing cleaunp for oldest orders');

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Below 30 days orders
      const oldOrders = await this.orderModel.findAll({
        where: {
          createdAt: {
            [Op.lt]: thirtyDaysAgo,
          }
        },
      });

      this.logger.log(
        `Find ${oldOrders.length} orders for cleanup`,
      );

      let deletedCount = 0;

      for (const order of oldOrders) {
        try {
          await this.orderItemModel.destroy({
            where: { order_id: order.id },
          });

          await this.orderStatusLogModel.destroy({
            where: { order_id: order.id },
          });

          await order.destroy();
          deletedCount++;

          this.logger.debug(`✅ Orden ${order.id} eliminada correctamente`);
        } catch (error) {
          this.logger.error(
            `Error droping order ${order.id}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Cleaunp complete: ${deletedCount}/${oldOrders.length} orders deleted`,
      );
    } catch (error) {
      this.logger.error(` Error in the cleanup job: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkStuckOrders() {
    this.logger.log('Verifying orders...');

    try {
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 12);

      // Orders with status = 'sent' 12 hours ago.
      const stuckOrders = await this.orderModel.findAll({
        where: {
          status: 'sent',
          updatedAt: {
            [Op.lt]: twoHoursAgo,
          },
        },
      });

      if (stuckOrders.length > 0) {
        this.logger.warn(
          `Find ${stuckOrders.length} orders stucked`,
        );

        for (const order of stuckOrders) {
          this.logger.warn(
            ` Order ${order.id} stuck since ${order.updatedAt}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in verify stuck orders: ${error.message}`,
      );
    }
  }

}
