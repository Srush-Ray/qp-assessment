import { Inject, Injectable } from '@nestjs/common';
import { PricingDto } from '../dto/create-pricing.dto';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import PricingEntityGateway from 'src/common/service-gateway/PricingEntityGateway';

@Injectable()
export class CreatePricingService {
  constructor(
    @Inject(InjectionKey.PRICING_GATEWAY)
    private pricingGateway: PricingEntityGateway,
  ) {}

  async createPricing({ pricingInfo }: { pricingInfo: PricingDto }) {
    return await this.pricingGateway.createPricing({
      priceInfo: pricingInfo,
    });
  }
}
