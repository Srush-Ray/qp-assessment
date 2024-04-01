import ItemEntityGateway from 'src/common/service-gateway/ItemEntityGateway';
import SqlCrudEntityGateway from '../base/sql-base-gateway';
import { ItemDto, UpdateItemDto } from 'src/modules/items/dto/create-item.dto';
import { TableNames } from 'src/constants/enums/TableNames';
import RestError from 'src/common/error/rest-error';
import { errorMessage } from 'src/constants/enums/common.constants';
import { PaginatedResult } from 'src/common/dto/response.dto';
import { ViewItemDto } from 'src/modules/items/dto/view-item.dto';

export default class SqlItemEntityGateway
  extends SqlCrudEntityGateway
  implements ItemEntityGateway
{
  async createItem({ itemInfo }: { itemInfo: ItemDto }): Promise<ItemDto> {
    try {
      const itemCreate = await this.insertOneWithId(
        TableNames.ITEMS,
        itemInfo,
        true,
      );
      return itemCreate;
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }
  async deleteItem({ id }: { id: string }): Promise<{ message: string }> {
    try {
      const itemsDeleted = await this.deleteWithId(TableNames.ITEMS, id);
      if (
        !!itemsDeleted?.[0]['affectedRows'] &&
        itemsDeleted?.[0]['affectedRows'] === 1
      ) {
        return {
          message: 'Item deleted successfully',
        };
      } else {
        return {
          message: 'Item ID not found',
        };
      }
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }
  async updateItemById({
    itemInfo,
    id,
  }: {
    itemInfo: UpdateItemDto;
    id: string;
  }): Promise<{ message: string }> {
    try {
      const items = await this.updateWithId(TableNames.ITEMS, itemInfo, id);
      if (!!items?.[0]['affectedRows'] && items?.[0]['affectedRows'] === 1) {
        return {
          message: 'Item updated successfully',
        };
      } else {
        return {
          message: 'Item ID not found',
        };
      }
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }

  async viewAllItems({
    limit,
    page,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ViewItemDto>> {
    try {
      const viewAllQuery = `(SELECT i.ID AS item_id,
        item_name,
        available_quantity,
        p.price,
        item_weight_unit,
        p.weight
        FROM ${TableNames.ITEMS} i
        LEFT JOIN ${TableNames.PRICING} p ON i.pricing_id=p.ID) AS derivedTable`;
      const paginationResult = await this.paginationSelect<ViewItemDto>({
        query: viewAllQuery,
        limit: limit ? limit : 5,
        page: page ? page : 1,
      });
      return {
        data: paginationResult?.result,
        metadata: paginationResult.metadata,
      };
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }
  async viewItemsById({
    item_id,
  }: {
    item_id: string[];
  }): Promise<ViewItemDto[]> {
    try {
      const viewAllQuery = `SELECT i.ID AS item_id,
        item_name,
        available_quantity,
        p.price,
        item_weight_unit,
        p.weight
        FROM ${TableNames.ITEMS} i
        LEFT JOIN ${TableNames.PRICING} p ON i.pricing_id=p.ID WHERE i.ID IN (?);`;

      const getIds = item_id?.map((it) => {
        if (it['id']) return it['id'];
        else return it;
      });
      const item = await this.runQuery<ViewItemDto>(viewAllQuery, [getIds]);
      if (!item?.length) {
        return [];
      }
      return item;
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }
}
