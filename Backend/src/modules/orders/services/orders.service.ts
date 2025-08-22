import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderStatusLogRepository } from '../repositories/order-status-log.repository';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderStatusLogRepository: OrderStatusLogRepository,
  ) {}

  async findAllOrders() {
    const orders = await this.orderRepository.findAllExceptDelivered();
    return orders;
  }

  async createOrderWithItems(createOrderDto: CreateOrderDto) {
    const total = createOrderDto.items.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);

    // Create Order
    const order = await this.orderRepository.create({
      client_name: createOrderDto.client_name,
      total: total,
      status: 'initiated',
    });

    // Create items
    const orderItems = createOrderDto.items.map((item) => ({
      order_id: order.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    await this.orderItemRepository.createMany(orderItems);

    // Create logs
    await this.orderStatusLogRepository.create({
      order_id: order.id,
      previous_status: 'created',
      new_status: 'initiated',
    });

    return this.orderRepository.findById(order.id, true);
  }

  async advanceOrder(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) return null;

    const previousStatus = order.dataValues.status;
    let newStatus: string;

    switch (previousStatus) {
      case 'initiated':
        newStatus = 'sent';
        break;
      case 'sent':
        newStatus = 'delivered';
        break;
      default:
        throw new Error(`Cannot advance order from status: ${previousStatus}`);
    }

    // Update Status
    await this.orderRepository.update(id, { status: newStatus });

    // Create logs
    await this.orderStatusLogRepository.create({
      order_id: id,
      previous_status: previousStatus,
      new_status: newStatus,
    });

    if (newStatus === 'delivered') {
      await this.orderItemRepository.deleteByOrderId(id);
      await this.orderStatusLogRepository.deleteByOrderId(id);
      await this.orderRepository.delete(id);
      return { ...order.toJSON(), status: 'delivered', deleted: true };
    }

    return this.orderRepository.findById(id, true);
  }

  async findOrderById(id: number) {
    return this.orderRepository.findById(id, true);
  }
}
