import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../typeOrm.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AdminModule } from './modules/admin/admin.module';
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
    DoctorModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
