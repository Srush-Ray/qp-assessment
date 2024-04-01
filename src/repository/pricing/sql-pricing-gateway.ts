import { PricingDto } from 'src/modules/pricing/dto/create-pricing.dto';
import SqlCrudEntityGateway from '../base/sql-base-gateway';
import PricingEntityGateway from 'src/common/service-gateway/PricingEntityGateway';
import { TableNames } from 'src/constants/enums/TableNames';
import PricingMapper from './pricing.mapper';
import RestError from 'src/common/error/rest-error';
import { errorMessage } from 'src/constants/enums/common.constants';

export default class SqlPricingEntityGateway
  extends SqlCrudEntityGateway
  implements PricingEntityGateway
{
  async createPricing({
    priceInfo,
  }: {
    priceInfo: PricingDto;
  }): Promise<PricingDto> {
    const params = PricingMapper.toModel(priceInfo);
    try {
      const pricing = await this.insertOneWithId(
        TableNames.PRICING,
        params,
        true,
      );
      return pricing;
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }

  async deletePricing({ id }: { id: string }): Promise<{ message: string }> {
    try {
      const pricing = await this.deleteWithId(TableNames.PRICING, id);
      if (
        !!pricing?.[0]['affectedRows'] &&
        pricing?.[0]['affectedRows'] === 1
      ) {
        return {
          message: 'Pricing deleted successfully',
        };
      } else {
        return {
          message: 'Pricing ID not found',
        };
      }
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }

  async updatePricingById({
    priceInfo,
    id,
  }: {
    priceInfo: PricingDto;
    id: string;
  }): Promise<{ message: string }> {
    try {
      const pricing = await this.updateWithId(
        TableNames.PRICING,
        priceInfo,
        id,
      );
      if (
        !!pricing?.[0]['affectedRows'] &&
        pricing?.[0]['affectedRows'] === 1
      ) {
        return {
          message: 'Pricing updated successfully',
        };
      } else {
        return {
          message: 'Pricing ID not found',
        };
      }
    } catch (error) {
      throw new RestError(errorMessage.sqlError, 400);
    }
  }
}
