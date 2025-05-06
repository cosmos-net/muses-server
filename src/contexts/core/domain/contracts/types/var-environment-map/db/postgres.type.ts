export type PostgresType = {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
  migrationsTableName: string;
  runMigrations?: boolean;
  logging?: boolean;
  tls?: boolean | { rejectUnauthorized: boolean } | { ca: string };
};
