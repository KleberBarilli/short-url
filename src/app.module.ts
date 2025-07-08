import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './app/modules/url/url.module';
import { UserModule } from './app/modules/user/user.module';

@Module({
  imports: [UrlModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
