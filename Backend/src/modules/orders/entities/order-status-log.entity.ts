import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { OrderEntity } from './order.entity';

@Table({ tableName: 'order_status_logs', timestamps: true, underscored: true })
export class OrderStatusLogEntity extends Model<OrderStatusLogEntity> {
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
  previous_status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  new_status: string;

  @BelongsTo(() => OrderEntity)
  order: OrderEntity;
}
