import { Controller, Get } from '@nestjs/common';

@Controller('hello-world')
export class AppController {
  @Get()
  hello() {
    return { message: 'Hello World!' };
  }
}
