import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderItems {
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrders {
  @IsNumber()
  @IsNotEmpty()
  pincode: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  total_amount: number;

  @IsNumber()
  @IsOptional()
  total_items: number;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsArray()
  items: CreateOrderItems[];
}
export class ViewOrderItemDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  total_weight: number;

  @IsString()
  @IsOptional()
  item_weight_unit: string;

  @IsString()
  @IsOptional()
  item_name?: string;
}
export class ViewOrderDto {
  @IsString()
  @IsNotEmpty()
  ID: string;

  @IsArray()
  @IsNotEmpty()
  items: ViewOrderItemDto[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  pincode: number;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsNotEmpty()
  total_items: number;
}
