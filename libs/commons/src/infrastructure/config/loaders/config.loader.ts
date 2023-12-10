import { EnvironmentEnum } from "@management-commons/domain/contracts/enums/environment.enum";
import { ConfigLoaderType } from "@management-commons/domain/contracts/types/config-loader.type";


export const ConfigLoader = (): ConfigLoaderType => ({
  client: {
    host: process.env.CLIENT_HOST,
    port: parseInt(process.env.CLIENT_PORT, 10),
    protocol: process.env.CLIENT_PROTOCOL,
  },
  server: {
    host: process.env.SERVER_HOST,
    port: parseInt(process.env.SERVER_PORT, 10),
    name: process.env.SERVER_NAME,
    env: process.env.SERVER_ENV as EnvironmentEnum,
  },
  databases: {
    postgres: {
      name: process.env.DB_POSTGRES_NAME,
      host: process.env.DB_POSTGRES_HOST,
      port: parseInt(process.env.DB_POSTGRES_PORT, 10),
      type: process.env.DB_POSTGRES_TYPE,
      username: process.env.DB_POSTGRES_USER,
      password: process.env.DB_POSTGRES_PASS,
      autoLoadEntities: process.env.DB_POSTGRES_AUTO_LOAD === 'true',
      synchronize: process.env.DB_POSTGRES_SYNC === 'true',
      logging: process.env.DB_POSTGRES_LOGGING === 'true',
      runMigrations: process.env.DB_POSTGRES_RUN_MIGRATIONS === 'true',
      migrationsTableName: process.env.DB_POSTGRES_MIGRATIONS_TABLE_NAME,
      tls: process.env.DB_POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    mongo: {
      name: process.env.DB_MONGO_NAME,
      host: process.env.DB_MONGO_HOST,
      password: process.env.DB_MONGO_PASS,
      port: parseInt(process.env.DB_MONGO_PORT, 10),
      type: process.env.DB_MONGO_TYPE,
      username: process.env.DB_MONGO_USER,
    },
  },
});
