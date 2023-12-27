// eslint-disable-next-line hexagonal-architecture/enforce
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as path from 'path';
import * as dotenv from 'dotenv';

const relative = path.join(process.cwd());

dotenv.config({ path: `${relative}/.env` });

// TODO: Generate migration in specific folder

console.log('HADES CONFIGURATION');

console.log('process.env.DB_POSTGRES_TYPE', process.env.DB_POSTGRES_TYPE);
console.log('process.env.DB_POSTGRES_HOST', process.env.DB_POSTGRES_HOST);
console.log('process.env.DB_POSTGRES_PORT', process.env.DB_POSTGRES_PORT);
console.log('process.env.DB_POSTGRES_USER', process.env.DB_POSTGRES_USER);
console.log('process.env.DB_POSTGRES_PASS', process.env.DB_POSTGRES_PASS);
console.log('process.env.DB_POSTGRES_NAME', process.env.DB_POSTGRES_NAME);
console.log('process.env.DB_POSTGRES_SYNC', process.env.DB_POSTGRES_SYNC);
console.log('process.env.DB_POSTGRES_SSL', process.env.DB_POSTGRES_SSL);

const {
  DB_POSTGRES_TYPE: type,
  DB_POSTGRES_HOST: host,
  DB_POSTGRES_PORT: portDB,
  DB_POSTGRES_USER: username,
  DB_POSTGRES_PASS: password,
  DB_POSTGRES_NAME: database,
  DB_POSTGRES_SYNC: withSynchronize,
  DB_POSTGRES_SSL: withSSL,
} = process.env;

const port = parseInt(portDB as string, 10);
const synchronize = withSynchronize === 'true';
const autoLoadEntities = true;
const migrationsTableName = 'migrations';
const ssl = withSSL === 'true' ? { rejectUnauthorized: false } : false;
const cli = { migrationsDir: `${relative}/dbs/hades/migrations` };
const entities = [`${relative}/apps/**/*-hades.entity.ts`, `${relative}/libs/**/*-commons.entity.ts`];
const migrations = [`${relative}/dbs/hades/migrations/*.ts`];
const seeds = [`${relative}/dbs/hades/seeds/**/*{.ts,.js}`];
const factories = [`${relative}/dbs/hades/factories/**/*{.ts,.js}`];

const options = {
  username,
  password,
  type,
  host,
  port,
  username,
  password,
  database,
  autoLoadEntities,
  migrationsTableName,
  ssl,
  cli,
  entities,
  migrations,
  seeds,
  factories,
  synchronize,
} as DataSourceOptions & SeederOptions;

export const dataSource = new DataSource(options);
