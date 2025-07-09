import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindManyUrlDto {
  @ApiPropertyOptional({ description: 'Skip' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  skip: number;

  @ApiPropertyOptional({ example: 10, description: 'Limit' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  take: number;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Sort' })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiPropertyOptional({ example: 'asc', description: 'Order' })
  @IsString()
  @IsOptional()
  order: string;
}
