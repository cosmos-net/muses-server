// eslint-disable-next-line hexagonal-architecture/enforce
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as path from 'path';
import * as dotenv from 'dotenv';

const relative = path.join(path.relative('.', __dirname), '..');

dotenv.config({ path: `${relative}/.env` });

// TODO: Generate migration in specific folder

const options = {
  type: process.env.DB_POSTGRES_TYPE,
  host: process.env.DB_POSTGRES_HOST,
  port: parseInt(process.env.DB_POSTGRES_PORT as string, 10),
  username: process.env.DB_POSTGRES_USER,
  password: process.env.DB_POSTGRES_PASS,
  database: process.env.DB_POSTGRES_NAME,
  synchronize: process.env.DB_POSTGRES_SYNC === 'true',
  autoLoadEntities: true,
  migrationsTableName: 'migrations',
  ssl:
    process.env.DB_POSTGRES_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
  cli: {
    migrationsDir: `${relative}/database/migrations`,
  },
  entities: [`${relative}/apps/**/*.entity.ts`],
  migrations: [`${relative}/db/postgresql/migrations/*.ts`],
  seeds: [`${relative}/database/seeds/**/*{.ts,.js}`],
  factories: [`${relative}/database/factories/**/*{.ts,.js}`],
} as DataSourceOptions & SeederOptions;

export const dataSource = new DataSource(options);
