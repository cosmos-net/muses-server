import { ConfigModuleOptions } from '@nestjs/config';
import { ClientLoader } from '@core/infrastructure/config/loaders/client.loader';
import { DatabasesLoader } from '@core/infrastructure/config/loaders/database.loader';
import { ServersLoader } from '@core/infrastructure/config/loaders/servers.loader';
import { UserRootLoader } from '@core/infrastructure/config/loaders/user-root.loader';
import { ConfigSchema } from '@core/infrastructure/config/schemas/config.schema';

export const MainConfigOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [
    ClientLoader,
    ServersLoader.main,
    ServersLoader.auth,
    DatabasesLoader.mongo,
    DatabasesLoader.postgres,
    UserRootLoader,
  ],
  validationSchema: ConfigSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env', '.env.local', '.env.test'],
};
