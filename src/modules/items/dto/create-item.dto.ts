import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemDto {
  @IsString()
  @IsOptional()
  ID?: string;

  @IsString()
  @IsNotEmpty()
  pricing_id: string;

  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsNumber()
  @IsNotEmpty()
  available_quantity: number;

  @IsString()
  @IsNotEmpty()
  item_weight_unit: string;
}
export class UpdateItemDto {
  @IsString()
  @IsOptional()
  pricing_id?: string;

  @IsString()
  @IsOptional()
  item_name?: string;

  @IsNumber()
  @IsOptional()
  available_quantity?: number;

  @IsString()
  @IsOptional()
  item_weight_unit?: string;
}
