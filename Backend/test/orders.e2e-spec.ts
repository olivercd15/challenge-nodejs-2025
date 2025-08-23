import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { OrderEntity } from 'src/modules/orders/entities/order.entity';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';
import { Sequelize } from 'sequelize-typescript';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    sequelize = moduleFixture.get<Sequelize>(Sequelize);
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /orders', () => {
    it('Returns list orders', async () => {
      const order = await OrderEntity.create({
        client_name: 'Test User',
        total: 100.00,
        status: 'initiated',
      } as any);

      return request(app.getHttpServer())
        .get('/orders')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(false);
          expect(response.body.data.length).toBe(1);
          expect(response.body.data[0].client_name).toBe('Test User');
          expect(response.body.data[0].status).toBe('initiated');
        });
    });
  });

  describe('POST /orders', () => {
    it('Create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        client_name: 'E2E Test User',
        items: [
          { description: 'Food', quantity: 1, unit_price: 50.00 },
          { description: 'Drink', quantity: 2, unit_price: 25.00 },
        ],
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201)
        .then((response) => {
          expect(response.body.data.client_name).toBe('E2E Test User');
          expect(response.body.data.total).toBe('100.00');
          expect(response.body.data.status).toBe('initiated');
          expect(response.body.data.items).toHaveLength(2);
        });
    });

  });

  describe('POST /orders/:id/advance', () => {
    it('Advance order to sent ', async () => {
      
        // Create order
      const order = await OrderEntity.create({
        client_name: 'Advance Test',
        total: 100.00,
        status: 'initiated',
      } as any);

      return request(app.getHttpServer())
        .post(`/orders/${order.id}/advance`)
        .expect(201)
        .then((response) => {
          expect(response.body.data.status).toBe('sent');
        });
    });

  });

  describe('GET /orders/:id', () => {
    it('Returns an order', async () => {
      const order = await OrderEntity.create({
        client_name: 'Get By ID Test',
        total: 200.00,
        status: 'sent',
      } as any);

      return request(app.getHttpServer())
        .get(`/orders/${order.id}`)
        .expect(200.00)
        .then((response) => {
          expect(response.body.data.client_name).toBe('Get By ID Test');
          expect(response.body.data.status).toBe('sent');
          expect(response.body.data.total).toBe('200.00');
        });
    });

    it('Returns invalid ID', async () => {
        return request(app.getHttpServer())
            .get('/orders/not-a-number')
            .expect(400);
    });
  });
});
