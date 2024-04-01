import { Inject, Injectable } from '@nestjs/common';
import { UpdateItemDto } from '../dto/create-item.dto';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';

@Injectable()
export class UpdateItemsService {
  constructor(
    @Inject(InjectionKey.ITEM_GATEWAY)
    private itemGateway: ItemEntityGateway,
  ) {}
  async updateItemById({
    itemDetails,
    id,
  }: {
    itemDetails: UpdateItemDto;
    id: string;
  }): Promise<{ message: string }> {
    return await this.itemGateway.updateItemById({
      itemInfo: itemDetails,
      id,
    });
  }
}
