import { Inject, Injectable } from '@nestjs/common';
import { CreateOrders, ViewOrderDto } from '../dto/order.dto';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import OrderEntityGateway from 'src/common/service-gateway/OrderEntityGateway';
import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';

@Injectable()
export class CreateOrderService {
  constructor(
    @Inject(InjectionKey.ORDER_GATEWAY)
    private orderGateway: OrderEntityGateway,
    @Inject(InjectionKey.ITEM_GATEWAY) private itemGateway: ItemEntityGateway,
  ) {}
  async createOrder({
    orderDetails,
  }: {
    orderDetails: CreateOrders;
  }): Promise<ViewOrderDto> {
    const ids = orderDetails?.items?.map((i) => {
      return i.item_id;
    });
    const items = await this.itemGateway.viewItemsById({
      item_id: ids,
    });
    return await this.orderGateway.createOrder({
      orderDetails,
      items,
    });
  }
}
