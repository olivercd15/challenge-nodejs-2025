import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusLogEntity } from './order-status-log.entity';

@Table({
  tableName: 'orders',
  timestamps: true,
  underscored: true,
})
export class OrderEntity extends Model<OrderEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'initiated',
  })
  status: string;

  @HasMany(() => OrderItemEntity)
  items: OrderItemEntity[];

  @HasMany(() => OrderStatusLogEntity)
  status_logs: OrderStatusLogEntity[];
}
