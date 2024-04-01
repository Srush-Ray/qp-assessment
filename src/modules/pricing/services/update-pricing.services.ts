import { Inject, Injectable } from '@nestjs/common';
import { PricingDto } from '../dto/create-pricing.dto';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import PricingEntityGateway from 'src/common/service-gateway/PricingEntityGateway';

@Injectable()
export class UpdatePricingService {
  constructor(
    @Inject(InjectionKey.PRICING_GATEWAY)
    private pricingGateway: PricingEntityGateway,
  ) {}

  async updatePricingById({
    pricingInfo,
    id,
  }: {
    pricingInfo: PricingDto;
    id: string;
  }): Promise<{ message: string }> {
    return await this.pricingGateway.updatePricingById({
      priceInfo: pricingInfo,
      id,
    });
  }
}
