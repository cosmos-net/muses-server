// eslint-disable-next-line hexagonal-architecture/enforce
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as path from 'path';
import * as dotenv from 'dotenv';

const relative = path.join(process.cwd());

dotenv.config({ path: `${relative}/.env` });

// TODO: Generate migration in specific folder

console.log('MUSES CONFIGURATION');

console.log('process.env.DB_MONGO_TYPE', process.env.DB_MONGO_TYPE);
console.log('process.env.DB_MONGO_HOST', process.env.DB_MONGO_HOST);
console.log('process.env.DB_MONGO_PORT', process.env.DB_MONGO_PORT);
console.log('process.env.DB_MONGO_USER', process.env.DB_MONGO_USER);
console.log('process.env.DB_MONGO_PASS', process.env.DB_MONGO_PASS);
console.log('process.env.DB_MONGO_NAME', process.env.DB_MONGO_NAME);
console.log('process.env.DB_MONGO_SYNC', process.env.DB_MONGO_SYNC);
console.log('process.env.DB_MONGO_SSL', process.env.DB_MONGO_SSL);

const {
  DB_MONGO_TYPE: type,
  DB_MONGO_HOST: host,
  DB_MONGO_PORT: portDB,
  DB_MONGO_USER: username,
  DB_MONGO_PASS: password,
  DB_MONGO_NAME: database,
  DB_MONGO_SYNC: withSynchronize,
  DB_MONGO_SSL: withSSL,
} = process.env;

const port = parseInt(portDB as string, 10);
const synchronize = withSynchronize === 'true';
const autoLoadEntities = true;
const migrationsTableName = 'migrations';
const ssl = withSSL === 'true' ? { rejectUnauthorized: false } : false;
const cli = { migrationsDir: `${relative}/dbs/muses/migrations`};
const entities = [`${relative}/apps/**/*-muses.entity.ts`];
const migrations = [`${relative}/dbs/muses/migrations/*.ts`];
const seeds = [`${relative}/dbs/muses/seeds/**/*{.ts,.js}`];
const factories = [`${relative}/dbs/muses/factories/**/*{.ts,.js}`];

const options = {
  "type": type, 
  "host": host,
  "port": port, 
  "database": "test", 
  "synchronize": true, 
  "logging": false, 
  // synchronize,
  autoLoadEntities,
  migrationsTableName,
  ssl,
  cli,
  entities,
  migrations,
  seeds,
  factories,
} as DataSourceOptions & SeederOptions;

export const dataSource = new DataSource(options);
