import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './app/modules/url/url.module';
import { UserModule } from './app/modules/user/user.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { IS_SENTRY_ENABLED } from './instrument';

const sentryModule = IS_SENTRY_ENABLED ? [SentryModule.forRoot()] : [];
@Module({
  imports: [...sentryModule, UrlModule, UserModule],
  controllers: [AppController],
  providers: [
    ...(IS_SENTRY_ENABLED
      ? [
          {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
          },
        ]
      : []),
    AppService,
  ],
})
export class AppModule {}
