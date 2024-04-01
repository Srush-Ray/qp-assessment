import { Inject, Injectable } from '@nestjs/common';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import OrderEntityGateway from 'src/common/service-gateway/OrderEntityGateway';
import { orderSearchKey } from 'src/constants/common.enum';
import { QueryPaginatedParamsDto } from 'src/common/dto/request.dto';
import { PaginatedResult } from 'src/common/dto/response.dto';

@Injectable()
export class GetOrderService {
  constructor(
    @Inject(InjectionKey.ORDER_GATEWAY)
    private orderGateway: OrderEntityGateway,
  ) {}
  async getOrders({
    key,
    value,
    pageParams,
  }: {
    key: orderSearchKey;
    value: string[];
    pageParams?: QueryPaginatedParamsDto;
  }): Promise<PaginatedResult<any>> {
    const dataResult = await this.orderGateway.getOrderDetails({
      key,
      value,
      pageParams,
    });
    return {
      result: dataResult?.data,
      metadata: dataResult?.metadata,
    };
  }
}
