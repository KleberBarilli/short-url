import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
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
}
