import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateOrderService } from './services/create.order.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrders, ViewOrderDto } from './dto/order.dto';
import { orderSearchKey } from 'src/constants/common.enum';
import { GetOrderService } from './services/get-orders.service';
import { QueryPaginatedParamsDto } from 'src/common/dto/request.dto';
import { PaginatedResult } from 'src/common/dto/response.dto';

@ApiTags('user-order')
@Controller('/v1/')
export class UserController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly getOrderService: GetOrderService,
  ) {}

  @Post('/order')
  async createOrder(@Body() orderDetails: CreateOrders): Promise<ViewOrderDto> {
    return await this.createOrderService.createOrder({ orderDetails });
  }

  @Post('/get-order')
  async getOrders(
    @Body() findDetails: { key: orderSearchKey; value: string[] },
    @Query() query?: QueryPaginatedParamsDto,
  ): Promise<PaginatedResult<any>> {
    return await this.getOrderService.getOrders({
      key: findDetails.key,
      value: findDetails?.value,
      pageParams: query,
    });
  }
}
