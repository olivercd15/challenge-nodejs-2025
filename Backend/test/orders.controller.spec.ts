import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from 'src/modules/orders/controllers/orders.controller';
import { OrderService } from 'src/modules/orders/services/orders.service';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';
import { CreateOrderValidationPipe } from 'src/modules/orders/pipes/create-order.validation.pipe';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { OrderCleanupService } from '@/modules/orders/jobs/order-cleanup.service';

// Mocks
const mockOrderService = {
  findAllOrders: jest.fn(),
  createOrderWithItems: jest.fn(),
  advanceOrder: jest.fn(),
  findOrderById: jest.fn(),
};

const mockCreateOrderValidationPipe = {
  transform: jest.fn().mockImplementation((value) => value),
};

const mockIdValidationPipe = {
  transform: jest.fn().mockImplementation((value) => parseInt(value, 10)),
};

const mockOrderCleanupService = {
  someMethod: jest.fn(),
};


describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: OrderCleanupService, useValue: mockOrderCleanupService },
        {
          provide: CreateOrderValidationPipe,
          useValue: mockCreateOrderValidationPipe,
        },
        { provide: IdValidationPipe, useValue: mockIdValidationPipe },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('Return all orders successfully', async () => {
      const mockOrders = [
        { id: 1, client_name: 'Juan Perez', status: 'initiated' },
        { id: 2, client_name: 'Maria Garcia', status: 'sent' },
      ];

      mockOrderService.findAllOrders.mockResolvedValue(mockOrders);

      const result = await controller.getAllOrders();

      expect(result).toEqual(mockOrders);
      expect(service.findAllOrders).toHaveBeenCalledTimes(1);
    });

    it('Return empty array if dont have orders', async () => {
      mockOrderService.findAllOrders.mockResolvedValue([]);

      const result = await controller.getAllOrders();

      expect(result).toEqual([]);
      expect(service.findAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /orders', () => {
    it('Create order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        client_name: 'Test User',
        items: [
          { description: 'Product 1', quantity: 2, unit_price: 10 },
          { description: 'Product 2', quantity: 1, unit_price: 20 },
        ],
      };

      const mockOrder = {
        id: 1,
        client_name: 'Test User',
        total: 40,
        status: 'initiated',
        items: createOrderDto.items,
      };

      mockOrderService.createOrderWithItems.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.createOrderWithItems).toHaveBeenCalledWith(createOrderDto);
      expect(service.createOrderWithItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /orders/:id/advance', () => {
    it('Advance an order successfully', async () => {
      const orderId = 1;
      const mockAdvancedOrder = {
        id: 1,
        client_name: 'Test User',
        status: 'sent',
        items: [],
      };

      mockOrderService.advanceOrder.mockResolvedValue(mockAdvancedOrder);

      const result = await controller.advanceOrder(orderId);

      expect(result).toEqual(mockAdvancedOrder);
      expect(service.advanceOrder).toHaveBeenCalledWith(orderId);
      expect(service.advanceOrder).toHaveBeenCalledTimes(1);
    });

    it('Manage order not founded', async () => {
      const orderId = 999;

      mockOrderService.advanceOrder.mockResolvedValue(null);

      const result = await controller.advanceOrder(orderId);

      expect(result).toBeNull();
      expect(service.advanceOrder).toHaveBeenCalledWith(orderId);
    });
  });

  describe('GET /orders/:id', () => {
    it('Returns an order by ID', async () => {
      const orderId = 1;
      const mockOrder = {
        id: 1,
        client_name: 'Test User',
        status: 'initiated',
        items: [],
      };

      mockOrderService.findOrderById.mockResolvedValue(mockOrder);

      const result = await controller.getOrder(orderId);

      expect(result).toEqual(mockOrder);
      expect(service.findOrderById).toHaveBeenCalledWith(orderId);
      expect(service.findOrderById).toHaveBeenCalledTimes(1);
    });

    it('Returns null if order does not exists', async () => {
      const orderId = 999;

      mockOrderService.findOrderById.mockResolvedValue(null);

      const result = await controller.getOrder(orderId);

      expect(result).toBeNull();
      expect(service.findOrderById).toHaveBeenCalledWith(orderId);
    });
  });
});
