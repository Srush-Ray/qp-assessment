import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PricingDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  ID?: string;
}
