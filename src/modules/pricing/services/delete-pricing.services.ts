import { Inject, Injectable } from '@nestjs/common';
import PricingEntityGateway from 'src/common/service-gateway/PricingEntityGateway';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';

@Injectable()
export class DeletePricingService {
  constructor(
    @Inject(InjectionKey.PRICING_GATEWAY)
    private pricingGateway: PricingEntityGateway,
  ) {}

  async deletePricingById({
    id,
  }: {
    id: string;
  }): Promise<{ message: string }> {
    return await this.pricingGateway.deletePricing({
      id,
    });
  }
}
