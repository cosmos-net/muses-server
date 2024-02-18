import { ConfigModuleOptions } from '@nestjs/config';
import { ClientLoader } from '@lib-commons/infrastructure/config/loaders/client.loader';
import { DatabasesLoader } from '@lib-commons/infrastructure/config/loaders/database.loader';
import { ServersLoader } from '@lib-commons/infrastructure/config/loaders/servers.loader';
import { UserRootLoader } from '@lib-commons/infrastructure/config/loaders/user-root.loader';
import { ConfigSchema } from '@app-main/modules/main/infrastructure/config/schemas/config.schema';

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
