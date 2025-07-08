import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateShortUrlDto,
  CreateShortUrlDtoResponse,
} from './dtos/create-short-url.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';

@Controller('api/urls')
@ApiTags('Urls')
export class UrlController {
  constructor(private createShortUrlService: CreateShortUrlService) {}

  @Post('shorten')
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully.',
    type: CreateShortUrlDtoResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Could not generate a unique short code.',
  })
  async createShortUrl(@Body() data: CreateShortUrlDto) {
    return this.createShortUrlService.execute(data.originalUrl);
  }
}
