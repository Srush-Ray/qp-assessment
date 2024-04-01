import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './modules/items/items.module';
import { UserModule } from './modules/user/user.module';
import { RepositoryModule } from './repository/repository.module';
import { PricingModule } from './modules/pricing/pricing.module';
import HttpResponseInterceptor, {
  ResponseMiddleware,
} from './common/middleware/interceptors/http-response-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RepositoryModule, ItemsModule, UserModule, PricingModule],
  controllers: [AppController],
  providers: [
    {
      provide: Logger.name,
      useFactory: () => new Logger(),
    },
    { provide: APP_INTERCEPTOR, useClass: HttpResponseInterceptor },
    AppService,
    ResponseMiddleware,
  ],
  exports: [
    ItemsModule,
    UserModule,
    PricingModule,
    RepositoryModule,
    ResponseMiddleware,
    Logger.name,
  ],
})
export class AppModule {}
