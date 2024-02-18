/* eslint-disable hexagonal-architecture/enforce */
export const MongoTestConfigLoader = () => ({
  mongo_test: {
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
  },
});
