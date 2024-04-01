import { ItemDto, UpdateItemDto } from 'src/modules/items/dto/create-item.dto';
import { PaginatedResult } from '../dto/response.dto';
import { ViewItemDto } from 'src/modules/items/dto/view-item.dto';

export default interface ItemEntityGateway {
  createItem({ itemInfo }: { itemInfo: ItemDto }): Promise<ItemDto>;
  deleteItem({ id }: { id: string }): Promise<{ message: string }>;
  updateItemById({
    itemInfo,
    id,
  }: {
    itemInfo: UpdateItemDto;
    id: string;
  }): Promise<{ message: string }>;
  viewAllItems({
    limit,
    page,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ViewItemDto>>;
  viewItemsById({ item_id }: { item_id: string[] }): Promise<ViewItemDto[]>;
}
