import { IsString, IsNumber, IsPositive, IsArray, ValidateNested, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Description Item is required' })
  description: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 1' })
  @IsPositive({ message: 'Quantity must be an entire positive number.' })
  quantity: number;

  @IsNumber()
  @Min(0.01, { message: 'Unit Price must be greater than 0.01' })
  @IsPositive({ message: 'Unit Price must be a positive number.' })
  unit_price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Client Name is required' })
  client_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
