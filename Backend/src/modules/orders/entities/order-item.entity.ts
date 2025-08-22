import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { OrderEntity } from './order.entity';

@Table({ tableName: 'order_items', timestamps: true, underscored: true })
export class OrderItemEntity extends Model<OrderItemEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => OrderEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  unit_price: number;

  @BelongsTo(() => OrderEntity)
  order: OrderEntity;
}
