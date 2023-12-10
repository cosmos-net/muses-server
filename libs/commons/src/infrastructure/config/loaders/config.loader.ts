import { EnvironmentEnum } from '@management-commons/domain/contracts/enums/environment.enum';
import { ConfigLoaderType } from '@management-commons/domain/contracts/types/config-loader.type';

export const ConfigLoader = (): ConfigLoaderType => ({
  client: {
    host: process.env.CLIENT_HOST as string,
    port: parseInt(process.env.CLIENT_PORT!, 10),
    protocol: process.env.CLIENT_PROTOCOL as string,
  },
  server: {
    host: process.env.SERVER_HOST as string,
    port: parseInt(process.env.SERVER_PORT!, 10),
    name: process.env.SERVER_NAME as string,
    env: process.env.SERVER_ENV as EnvironmentEnum,
  },
  databases: {
    postgres: {
      name: process.env.DB_POSTGRES_NAME as string,
      host: process.env.DB_POSTGRES_HOST as string,
      port: parseInt(process.env.DB_POSTGRES_PORT!, 10),
      type: process.env.DB_POSTGRES_TYPE as string,
      username: process.env.DB_POSTGRES_USER as string,
      password: process.env.DB_POSTGRES_PASS as string,
      autoLoadEntities: process.env.DB_POSTGRES_AUTO_LOAD === 'true',
      synchronize: process.env.DB_POSTGRES_SYNC === 'true',
      logging: process.env.DB_POSTGRES_LOGGING === 'true',
      runMigrations: process.env.DB_POSTGRES_RUN_MIGRATIONS === 'true',
      migrationsTableName: process.env
        .DB_POSTGRES_MIGRATIONS_TABLE_NAME as string,
      tls:
        process.env.DB_POSTGRES_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
    },
    mongo: {
      name: process.env.DB_MONGO_NAME as string,
      host: process.env.DB_MONGO_HOST as string,
      password: process.env.DB_MONGO_PASS as string,
      port: parseInt(process.env.DB_MONGO_PORT!, 10),
      type: process.env.DB_MONGO_TYPE as string,
      username: process.env.DB_MONGO_USER as string,
    },
  },
});
