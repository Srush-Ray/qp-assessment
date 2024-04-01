import { Module, forwardRef } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as MYSQL from 'mysql2/promise';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectionKey } from 'src/constants/enums/injection-key.enum';
import SqlItemEntityGateway from './item/sql-item-gateway';
import SqlPricingEntityGateway from './pricing/sql-pricing-gateway';
import SqlOrderEntityGateway from './order/sql-order-gateway';

@Module({
  imports: [forwardRef(() => AppModule), ConfigModule],
  providers: [
    {
      provide: 'MYSQL_CONNECTION',
      useFactory: async (configSerivce: ConfigService) => {
        console.log('connecting to MYSQL Server and grocery schema');
        return MYSQL.createPool({
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: '',
          database: 'grocery',
          ...(configSerivce.get<string>('NODE_ENV') !== 'local'
            ? { ssl: { rejectUnauthorized: false } }
            : {}),
          connectTimeout: 10 * 60 * 1000,
          multipleStatements: true,
        });
      },
      inject: [ConfigService],
    },
    { provide: InjectionKey.ITEM_GATEWAY, useClass: SqlItemEntityGateway },
    {
      provide: InjectionKey.PRICING_GATEWAY,
      useClass: SqlPricingEntityGateway,
    },
    { provide: InjectionKey.ORDER_GATEWAY, useClass: SqlOrderEntityGateway },
  ],
  exports: [
    InjectionKey.ITEM_GATEWAY,
    InjectionKey.PRICING_GATEWAY,
    InjectionKey.ORDER_GATEWAY,
  ],
})
export class RepositoryModule {}
