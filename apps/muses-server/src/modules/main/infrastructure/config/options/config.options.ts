import { DatabaseConfigLoader } from '@libs/commons/infrastructure/config/loaders/database.loader';
import { ServerConfigLoader } from '@libs/commons/infrastructure/config/loaders/server.loader';
import { ConfigSchema } from '@my-monolithic/modules/main/infrastructure/config/schemas/config.schema';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

export const MainConfigOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [ServerConfigLoader, DatabaseConfigLoader],
  validationSchema: ConfigSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env', '.env.local', '.env.test'],
};
