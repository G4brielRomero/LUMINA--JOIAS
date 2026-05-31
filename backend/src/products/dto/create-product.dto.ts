import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsInt, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Anel Solitário' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Anel de ouro 18k com diamante' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Ouro 18k' })
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiPropertyOptional({ example: 'Diamante' })
  @IsOptional()
  @IsString()
  gemstone?: string;

  @ApiProperty({ example: 5.2 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weight_g: number;

  @ApiProperty({ example: 2500.0 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;
}
