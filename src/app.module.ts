import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../typeOrm.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProvinceModule } from './modules/province/province.module';
import { DistrictModule } from './modules/district/district.module';
import { WardModule } from './modules/ward/ward.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import mySql from './db/mySql';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return mySql;
      },
      async dataSourceFactory() {
        if (!dataSource) {
          throw new Error('Invalid dataSource options passed');
        }
        return addTransactionalDataSource(dataSource);
      },
    }),
    AuthModule,
    UsersModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
