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
import { BrandModule } from './modules/brand/brand.module';
import { BreadcrumbModule } from './modules/breadcrumb/breadcrumb.module';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { LabelsModule } from './modules/labels/labels.module';
import { CartModule } from './modules/cart/cart.module';
import { SearchModule } from './modules/search/search.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserReactionModule } from './modules/user-reaction/user-reaction.module';
import mySql from './db/mySql';
import { WebSocketModule } from '../src/Gateway/app.gateway.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';

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
    BrandModule,
    BreadcrumbModule,
    ProductDetailModule,
    CloudinaryModule,
    LabelsModule,
    CartModule,
    SearchModule,
    CommentModule,
    UserReactionModule,
    WebSocketModule,
    CouponModule,
    OrderModule,
    OrderDetailModule,
  ],
  controllers: [],
})
export class AppModule {}
