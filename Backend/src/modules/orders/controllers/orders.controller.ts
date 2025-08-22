import { Controller, Get, Post, Param, Body, UsePipes, UseInterceptors } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderService } from '../services/orders.service';
import { CreateOrderValidationPipe } from '../pipes/create-order.validation.pipe';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor';

@Controller('orders')
@UseInterceptors(LoggingInterceptor, TransformResponseInterceptor)
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.findAllOrders();
  }

  @Post()
  @UsePipes(new CreateOrderValidationPipe())
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithItems(createOrderDto);
  }

  @Post(':id/advance')
  async advanceOrder(@Param('id', IdValidationPipe) id: number) {
    return this.orderService.advanceOrder(id);
  }

  @Get(':id')
  async getOrder(@Param('id', IdValidationPipe) id: number) {
    return this.orderService.findOrderById(id);
  }
}
