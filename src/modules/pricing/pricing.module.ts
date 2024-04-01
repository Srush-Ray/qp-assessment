import { Module, forwardRef } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { CreatePricingService } from './services/create-pricing.services';
import { UpdatePricingService } from './services/update-pricing.services';
import { DeletePricingService } from './services/delete-pricing.services';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [CreatePricingService, UpdatePricingService, DeletePricingService],
  exports: [CreatePricingService, UpdatePricingService, DeletePricingService],
  controllers: [PricingController],
})
export class PricingModule {}
