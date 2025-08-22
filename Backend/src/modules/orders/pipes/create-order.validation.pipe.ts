import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CreateOrderValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype === CreateOrderDto) {
      const object = plainToClass(metadata.metatype, value);
      const errors = await validate(object);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error).join(', '),
        );
        throw new BadRequestException(
          `Validation failed: ${errorMessages.join('; ')}`,
        );
      }
    }
    return value;
  }
}
