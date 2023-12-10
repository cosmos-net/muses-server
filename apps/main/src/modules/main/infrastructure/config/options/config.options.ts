import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { ConfigSchema } from '@management-main/modules/main/infrastructure/config/schemas/config.schema';
import { ServerLoader } from '@management-commons/infrastructure/config/loaders/server.loader';
import { DatabasesLoader } from '@management-commons/infrastructure/config/loaders/database.loader';
import { ClientLoader } from '@management-commons/infrastructure/config/loaders/client.loader';

export const MainConfigOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [
    ClientLoader,
    ServerLoader,
    DatabasesLoader.mongo,
    DatabasesLoader.postgres,
  ],
  validationSchema: ConfigSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env', '.env.local', '.env.test'],
};
