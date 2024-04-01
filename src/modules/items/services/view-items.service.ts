import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/common/dto/response.dto';
import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import { ViewItemDto } from '../dto/view-item.dto';

@Injectable()
export class ViewItemsService {
  constructor(
    @Inject(InjectionKey.ITEM_GATEWAY) private itemGateway: ItemEntityGateway,
  ) {}
  async viewAllItems({
    limit,
    page,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ViewItemDto>> {
    const data = await this.itemGateway.viewAllItems({
      limit,
      page,
    });
    const updatedItems = data?.data?.map((d) => {
      return {
        item_id: d.item_id,
        item_name: d.item_name,
        available_quantity: d.available_quantity,
        price: d.price,
        item_weight_unit: d.item_weight_unit,
        weight: d.weight,
      };
    });
    return {
      result: updatedItems,
      metadata: data?.metadata,
    };
  }

  async viewItemById({
    id,
  }: {
    id: string;
  }): Promise<ViewItemDto | { message: string }> {
    const item = await this.itemGateway.viewItemsById({ item_id: [id] });
    if (item?.length) {
      return item?.[0];
    } else {
      return {
        message: 'Item not found',
      };
    }
  }
}
