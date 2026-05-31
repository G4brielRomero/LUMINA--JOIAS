import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, IsInt, IsPositive, ArrayMinSize } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-do-produto' })
  @IsString()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-do-cliente' })
  @IsString()
  customer_id: string;

  @ApiPropertyOptional({ example: 'Entregar na loja' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
