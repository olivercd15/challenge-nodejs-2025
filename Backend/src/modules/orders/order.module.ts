import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusLogEntity } from './entities/order-status-log.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderStatusLogRepository } from './repositories/order-status-log.repository';
import { OrderService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { OrderCleanupService } from './jobs/order-cleanup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      OrderStatusLogEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrderRepository,
    OrderItemRepository,
    OrderStatusLogRepository,
    OrderService,
    OrderCleanupService,
  ],
  exports: [OrderService],
})
export class OrdersModule {}
