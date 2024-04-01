import { Inject, Injectable } from '@nestjs/common';
import { ItemDto } from '../dto/create-item.dto';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';

@Injectable()
export class CreateItemsService {
  constructor(
    @Inject(InjectionKey.ITEM_GATEWAY)
    private itemGateway: ItemEntityGateway,
  ) {}
  async createItem({ itemDetails }: { itemDetails: ItemDto }) {
    return await this.itemGateway.createItem({
      itemInfo: itemDetails,
    });
  }
}
