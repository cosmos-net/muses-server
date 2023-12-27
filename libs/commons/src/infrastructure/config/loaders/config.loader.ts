import { EnvironmentEnum, VarEnvMapConfigType } from '@lib-commons/domain';

export const ConfigLoader = (): VarEnvMapConfigType => ({
  client: {
    host: process.env.CLIENT_HOST as string,
    port: parseInt(process.env.CLIENT_PORT!, 10),
    protocol: process.env.CLIENT_PROTOCOL as string,
  },
  servers: {
    main: {
      host: process.env.SERVER_MAIN_HOST as string,
      port: parseInt(process.env.SERVER_MAIN_PORT!, 10),
      name: process.env.SERVER_MAIN_NAME as string,
      env: process.env.SERVER_MAIN_ENV as EnvironmentEnum,
    },
    auth: {
      host: process.env.SERVER_AUTH_HOST as string,
      port: parseInt(process.env.SERVER_AUTH_PORT!, 10),
      name: process.env.SERVER_AUTH_NAME as string,
      env: process.env.SERVER_AUTH_ENV as EnvironmentEnum,
      hashSalt: parseInt(process.env.CRYPT_SALT_ROUNDS!, 10),
    },
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
      migrationsTableName: process.env.DB_POSTGRES_MIGRATIONS_TABLE_NAME as string,
      tls: process.env.DB_POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    mongo: {
      name: process.env.DB_MONGO_NAME as string,
      host: process.env.DB_MONGO_HOST as string,
      password: process.env.DB_MONGO_PASS as string,
      port: parseInt(process.env.DB_MONGO_PORT!, 10),
      type: process.env.DB_MONGO_TYPE as string,
      username: process.env.DB_MONGO_USER as string,
      autoLoadEntities: process.env.DB_MONGO_AUTO_LOAD === 'true',
      migrationsTableName: process.env.DB_MONGO_MIGRATIONS_TABLE_NAME as string,
      synchronize: process.env.DB_MONGO_SYNC === 'true',
      logging: process.env.DB_MONGO_LOGGING === 'true',
      runMigrations: process.env.DB_MONGO_RUN_MIGRATIONS === 'true',
      tls: process.env.DB_MONGO_SSL === 'true',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
  userRoot: {
    username: process.env.USER_ROOT_USERNAME as string,
    password: process.env.USER_ROOT_PASSWORD as string,
    email: process.env.USER_ROOT_EMAIL as string,
  },
});
