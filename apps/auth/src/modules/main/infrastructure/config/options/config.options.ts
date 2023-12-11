import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { ConfigSchema } from '@management-main/modules/main/infrastructure/config/schemas/config.schema';
import { ServersLoader } from '@management-commons/infrastructure/config/loaders/servers.loader';
import { DatabasesLoader } from '@management-commons/infrastructure/config/loaders/database.loader';
import { ClientLoader } from '@management-commons/infrastructure/config/loaders/client.loader';
import { JwtLoader } from '@management-commons/infrastructure/config/loaders/jwt.loader';
import { UserRootLoader } from '@management-commons/infrastructure/config/loaders/user-root.loader';

export const MainConfigOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [
    ClientLoader,
    ServersLoader.main,
    ServersLoader.auth,
    DatabasesLoader.mongo,
    DatabasesLoader.postgres,
    JwtLoader,
    UserRootLoader,
  ],
  validationSchema: ConfigSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env', '.env.local', '.env.test'],
};
