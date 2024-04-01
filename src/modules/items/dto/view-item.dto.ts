import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ViewItemDto {
  @IsString()
  @IsOptional()
  item_id?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  item_name: string;

  @IsNumber()
  @IsOptional()
  available_quantity?: number;

  @IsString()
  @IsOptional()
  item_weight_unit?: string;
}
