import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreateShortUrlDto,
  CreateShortUrlDtoResponse,
} from './dtos/create-short-url.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { Request, Response } from 'express';
import { FindManyUrlByUserService } from 'src/app/core/url/services/find-many-url-by-user.service';
import { JwtGuard } from 'src/app/core/user/auth/jwt.guard';
import { FindManyUrlDto } from './dtos/find-many-url.dto';
import { UpdateOriginalUrlService } from 'src/app/core/url/services/update-original-url.service';
import { UpdateOriginalUrlDto } from './dtos/update-original-url.dto';
import { DeleteShortUrlService } from 'src/app/core/url/services/delete-short-url.service';
import { IncrementClicksService } from 'src/app/core/url/services/increment-clicks.service';

@Controller()
@ApiTags('Urls')
export class UrlController {
  constructor(
    private createShortUrlService: CreateShortUrlService,
    private findManyUrlByUserService: FindManyUrlByUserService,
    private updateOriginalUrlService: UpdateOriginalUrlService,
    private deleteShortUrlService: DeleteShortUrlService,
    private incrementClicksService: IncrementClicksService,
  ) {}

  @ApiOperation({
    summary: 'Redirect to original URL by short code',
  })
  @Get(':code')
  async redirectLink(@Param('code') code: string, @Res() res: Response) {
    const originalUrl = await this.incrementClicksService.execute(code);
    return res.redirect(originalUrl);
  }

  @Post('api/urls/shorten')
  @ApiOperation({
    summary: 'Create a new short URL',
    description: 'Generates an unique short URL for the provided original URL.',
  })
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
  async createShortUrl(
    @Body() data: CreateShortUrlDto,
    @Req() { user }: Request,
  ) {
    return this.createShortUrlService.execute(data.originalUrl, user?.sub);
  }

  @UseGuards(JwtGuard)
  @Get('api/urls')
  @ApiOperation({
    summary: 'List all URLs for the authenticated user',
    description:
      'Retrieves a paginated list of all URLs created by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List all URLs for the authenticated user.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAllUrls(
    @Req() { user }: Request,
    @Query() { skip, sort, take, order }: FindManyUrlDto,
  ) {
    return this.findManyUrlByUserService.execute(user?.sub as string, {
      skip,
      take,
      sort,
      order,
    });
  }

  @UseGuards(JwtGuard)
  @Patch('api/urls/:id')
  @ApiOperation({
    summary: 'Update original URL for a short URL',
    description:
      'Updates the original URL for a given short URL ID. Only the owner can update it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated original URL.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateOriginalUrl(
    @Req() { user }: Request,
    @Param('id') id: string,
    @Body() { originalUrl }: UpdateOriginalUrlDto,
  ) {
    return this.updateOriginalUrlService.execute(
      id,
      user?.sub as string,
      originalUrl,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('api/urls/:id')
  @ApiOperation({
    summary: 'Soft delete a short URL',
    description: 'Deletes a short URL by its ID. Only the owner can delete it.',
  })
  @ApiResponse({
    status: 204,
    description: 'Short URL deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteShortUrl(@Req() { user }: Request, @Param('id') id: string) {
    return this.deleteShortUrlService.execute(id, user?.sub as string);
  }
}
