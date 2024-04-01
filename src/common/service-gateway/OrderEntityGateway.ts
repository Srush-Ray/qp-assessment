import { orderSearchKey } from 'src/constants/common.enum';
import { ViewItemDto } from 'src/modules/items/dto/view-item.dto';
import { CreateOrders, ViewOrderDto } from 'src/modules/user/dto/order.dto';
import { QueryPaginatedParamsDto } from '../dto/request.dto';
import { PaginatedResult } from '../dto/response.dto';

export default interface OrderEntityGateway {
  createOrder({
    orderDetails,
    items,
  }: {
    orderDetails: CreateOrders;
    items: ViewItemDto[];
  }): Promise<ViewOrderDto>;
  getOrderDetails({
    key,
    value,
    pageParams,
  }: {
    key: orderSearchKey;
    value: string[];
    pageParams?: QueryPaginatedParamsDto;
  }): Promise<PaginatedResult<any>>;
}
