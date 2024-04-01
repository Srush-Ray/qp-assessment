import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateOrderService } from './services/create.order.service';
import { AppModule } from 'src/app.module';
import { GetOrderService } from './services/get-orders.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [CreateOrderService, GetOrderService],
  exports: [CreateOrderService, GetOrderService],
  controllers: [UserController],
})
export class UserModule {}
