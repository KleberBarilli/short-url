import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';
import { CreateShortUrlResponse } from 'src/app/core/url/types/CreateShortUrlResponse';

export class CreateShortUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example:
      'https://www.science.org/do/10.1126/science.abb1641/full/Supermassive_blackhole_planet-1644914672373.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'How many days the short URL will be valid (Optional)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  expiresInDays?: number;
}

export class CreateShortUrlDtoResponse implements CreateShortUrlResponse {
  @ApiProperty({
    example:
      'https://www.science.org/do/10.1126/science.abb1641/full/Supermassive_blackhole_planet-1644914672373.jpg',
  })
  originalUrl: string;

  @ApiProperty({
    example: 'http://localhost/012345',
  })
  shortUrl: string;

  @ApiProperty({
    example: '2025-07-10 21:10:35.205',
  })
  expiresAt?: Date;
}
