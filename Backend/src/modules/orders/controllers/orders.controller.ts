import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderService } from '../services/orders.service';
import { CreateOrderValidationPipe } from '../pipes/create-order.validation.pipe';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor';
import { OrderCleanupService } from '../jobs/order-cleanup.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheResponse } from '@/common/decorators/cache.decorator';


@Controller('orders')
@UseInterceptors(
  LoggingInterceptor,
  TransformResponseInterceptor,
  CacheInterceptor,
)
export class OrdersController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderCleanupService: OrderCleanupService,
  ) {}

  @Get()
  @CacheKey('all_orders')
  @CacheTTL(30) // 30 Secs Cache
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
  @CacheKey('order_:id')
  @CacheTTL(30)
  async getOrder(@Param('id', IdValidationPipe) id: number) {
    return this.orderService.findOrderById(id);
  }

  @Post('cleanup-orders')
  async manualCleanup() {
    await this.orderCleanupService.cleanupOldOrders();
    return { message: 'Limpieza manual ejecutada correctamente' };
  }
}
