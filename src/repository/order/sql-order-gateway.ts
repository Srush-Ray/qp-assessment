import OrderEntityGateway from 'src/common/service-gateway/OrderEntityGateway';
import SqlCrudEntityGateway from '../base/sql-base-gateway';
import { CreateOrders, ViewOrderDto } from 'src/modules/user/dto/order.dto';
import { TableNames } from 'src/constants/enums/TableNames';
import { ViewItemDto } from 'src/modules/items/dto/view-item.dto';
import { v4 as uuidv4 } from 'uuid';
import RestError from 'src/common/error/rest-error';
import { orderSearchKey } from 'src/constants/common.enum';
import { QueryPaginatedParamsDto } from 'src/common/dto/request.dto';
import { PaginatedResult } from 'src/common/dto/response.dto';

export default class SqlOrderEntityGateway
  extends SqlCrudEntityGateway
  implements OrderEntityGateway
{
  async createOrder({
    orderDetails,
    items,
  }: {
    orderDetails: CreateOrders;
    items: ViewItemDto[];
  }): Promise<ViewOrderDto> {
    const orderTotals = orderDetails?.items?.reduce(
      (acc, curr) => {
        const currentItem = items?.find((i) => i?.item_id === curr?.item_id);
        if (currentItem?.item_id) {
          return {
            amount: acc?.amount + currentItem?.price * (curr.quantity || 1),
            count: acc.count + 1,
          };
        }
      },
      {
        amount: 0,
        count: 0,
      },
    );
    const uuid = uuidv4().replace(/\-/g, '');
    const orderDetailsToInsert = {
      address: orderDetails?.address,
      pincode: orderDetails?.pincode,
      mobile_number: orderDetails?.mobile_number,
      customer_name: orderDetails?.customer_name,
      total_amount: orderTotals.amount,
      total_items: orderTotals.count,
      ID: uuid,
    };
    const orderDetailsAdded = await this.insert(
      TableNames.ORDERS,
      orderDetailsToInsert,
      true,
    );
    const orderItems = orderDetails?.items?.map((o) => {
      const currentItem = items?.find((i) => i?.item_id === o?.item_id);
      if (currentItem) {
        return {
          order_id: uuid,
          item_id: o.item_id,
          price: currentItem?.price,
          quantity: o?.quantity || 1,
          total_price: currentItem?.price * (o.quantity || 1),
          weight: currentItem.weight,
          total_weight: currentItem?.weight * (o.quantity || 1),
          item_weight_unit: currentItem.item_weight_unit,
        };
      }
    });
    const result = await Promise.all(
      orderItems.map(async (o) => {
        const insertInOrder = await this.insertOneWithId(
          TableNames.ORDER_ITEM,
          o,
          true,
        );
        return insertInOrder;
      }),
    )
      .then(async (res) => {
        return { ...orderDetailsAdded, ID: uuid, items: res };
      })
      .catch((e) => {
        throw new RestError(e, 400);
      });
    return result;
  }

  async getOrderDetails({
    key,
    value = [],
    pageParams,
  }: {
    key: orderSearchKey;
    value: string[];
    pageParams?: QueryPaginatedParamsDto;
  }): Promise<PaginatedResult<any>> {
    let query = 'WHERE';
    switch (key) {
      case orderSearchKey.mobile:
        query = query + ' o.mobile_number IN (?)';
        const mobileData = [];
        value?.forEach((num) => {
          if (!num.includes('+91')) {
            mobileData.push('91' + num);
          } else {
            mobileData.push(num?.replace('+91', ''));
          }
          mobileData.push(num);
        });
        value = mobileData;
        break;
      case orderSearchKey.id:
        query = query + ' o.id IN (?)';
        break;
      default:
        query = '';
        break;
    }
    const queryToGet = `(SELECT  
    o.ID,
    o.customer_name,
    o.mobile_number,
    o.address,
    o.pincode,
    o.total_amount,
    o.total_items,
    JSON_ARRAYAGG(JSON_OBJECT(
      'item_name',i.item_name,
      'item_id',oi.item_id,
      'price',oi.price,
      'quantity',oi.quantity,
      'total_price',oi.total_price,
      'weight',oi.weight,
      'total_weight',oi.total_weight,
      'item_weight_unit',i.item_weight_unit
      )) AS order_item_booked
    FROM ${TableNames.ORDERS} o
    LEFT JOIN ${TableNames.ORDER_ITEM} oi ON o.ID = oi.order_id
    LEFT JOIN ${TableNames.ITEMS} i ON i.ID = oi.item_id
    ${query}
    GROUP BY o.ID
    ) AS derivedTable`;
    const result = await this.paginationSelect(
      {
        query: queryToGet,
        limit: pageParams?.limit ? pageParams?.limit : 5,
        page: pageParams?.page ? pageParams?.page : 1,
      },
      [value],
    );

    console.log('here result', result);
    return { data: result?.result, metadata: result.metadata };
  }
}
