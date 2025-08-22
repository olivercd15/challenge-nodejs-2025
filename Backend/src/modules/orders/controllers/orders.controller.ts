import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.findAllOrders();
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithItems(createOrderDto);
  }

  @Post(':id/advance')
  async advanceOrder(@Param('id') id: string) {
    return this.orderService.advanceOrder(Number(id));
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.findOrderById(Number(id));
  }
}
