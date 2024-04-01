import { Inject, Injectable } from '@nestjs/common';
import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';

@Injectable()
export class DeleteItemsService {
  constructor(
    @Inject(InjectionKey.ITEM_GATEWAY)
    private itemGateway: ItemEntityGateway,
  ) {}
  async deleteItemById({ id }: { id: string }): Promise<{ message: string }> {
    return await this.itemGateway.deleteItem({
      id,
    });
  }
}
