import { PricingDto } from 'src/modules/pricing/dto/create-pricing.dto';

export default interface PricingEntityGateway {
  createPricing({ priceInfo }: { priceInfo: PricingDto }): Promise<PricingDto>;
  deletePricing({ id }: { id: string }): Promise<{ message: string }>;
  updatePricingById({
    priceInfo,
    id,
  }: {
    priceInfo: PricingDto;
    id: string;
  }): Promise<{ message: string }>;
}
