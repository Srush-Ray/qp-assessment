import { PricingDto } from 'src/modules/pricing/dto/create-pricing.dto';

export default class PricingMapper {
  static toModel(tempPrice: PricingDto): PricingDto {
    return {
      price: tempPrice.price,
      weight: tempPrice.weight,
    };
  }
}
