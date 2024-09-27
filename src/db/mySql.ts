import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
require('dotenv').config();

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  logger: 'debug',
  charset: 'utf8mb4',
  synchronize: false,
  entities: [path.join(__dirname, '../..', '/modules/**/entities/*.entity{.ts,.js}')],
  migrations: [
    path.join(__dirname, '../..', '/migrations/*{.ts,.js}'),
    path.join(__dirname, '../..', '/migrations/seeds/*{.ts,.js}'),
  ],
  // subscribers: [
  //   path.join(__dirname, '../..', 'modules/user-healthcare-logs/user-healthcare-log.subscriber.ts'),
  //   path.join(__dirname, '../..', 'modules/user-location-logs/user-location-logs.subscriber.ts'),
  // ],
  autoLoadEntities: true,
  replication: {
    master: {
      host: process.env.MASTER_RDS_HOST,
      port: Number(process.env.MASTER_RDS_PORT) || 3306,
      username: process.env.MASTER_RDS_USERNAME,
      password: process.env.MASTER_RDS_PASSWORD,
      database: process.env.MASTER_RDS_DATABASE,
    },
    slaves: [
      {
        host: process.env.SLAVE_RDS_HOST,
        port: Number(process.env.SLAVE_RDS_PORT) || 3306,
        username: process.env.SLAVE_RDS_USERNAME,
        password: process.env.SLAVE_RDS_PASSWORD,
        database: process.env.SLAVE_RDS_DATABASE,
      },
    ],
  },
  connectorPackage: 'mysql2',
};

export default dbConfig;
