import { IsString, IsNumber, IsPositive, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unit_price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
