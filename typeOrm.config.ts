import { DataSource } from 'typeorm';
import path from 'path';
require('dotenv').config();

export default new DataSource({
  type: 'mysql',
  port: Number(process.env.MASTER_RDS_PORT) || 3306,
  host: process.env.MASTER_RDS_HOST,
  username: process.env.MASTER_RDS_USERNAME,
  password: process.env.MASTER_RDS_PASSWORD,
  database: process.env.MASTER_RDS_DATABASE,
  synchronize: false,
  logging: ['error', 'query'],
  entities: [path.join(__dirname, './src/entities/*.entity{.ts,.js}')],
  migrations: [
    path.join(__dirname, './src/migrations/*{.ts,.js}'),
    path.join(__dirname, './src/migrations/seeds/*{.ts,.js}'),
  ],
  // subscribers: [path.join(__dirname, './src/modules/**/*.subscriber{.ts,.js}')],
  migrationsRun: true,
  cache: {
    type: 'redis',
    duration: 60000,
    options: {
      url: 'redis://default:UrUeINhOYEMkjkHFVclvPTIjBeqgwqkC@junction.proxy.rlwy.net:38693',
    },
  },
});
