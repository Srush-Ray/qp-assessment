import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { adminAuthGuard } from 'src/common/middleware/auth-gaurd';
import { PricingDto } from './dto/create-pricing.dto';
import { CreatePricingService } from './services/create-pricing.services';
import { UpdatePricingService } from './services/update-pricing.services';
import { DeletePricingService } from './services/delete-pricing.services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('/v1/pricing')
@UseGuards(adminAuthGuard)
export class PricingController {
  constructor(
    private readonly createPricingService: CreatePricingService,
    private readonly updatePricingService: UpdatePricingService,
    private readonly deletePricingService: DeletePricingService,
  ) {}
  @Post(`/`)
  async createPricing(@Body() pricingInfo: PricingDto): Promise<any> {
    return await this.createPricingService.createPricing({ pricingInfo });
  }

  @Patch(`/:id`)
  async updatePricing(
    @Body() pricingInfo: PricingDto,
    @Param() id: string,
  ): Promise<{ message: string }> {
    return await this.updatePricingService.updatePricingById({
      pricingInfo,
      id,
    });
  }

  @Delete(`/:id`)
  async deletePricing(@Param() id: string): Promise<{ message: string }> {
    return await this.deletePricingService.deletePricingById({ id });
  }
}
