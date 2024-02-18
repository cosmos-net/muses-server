import { ClientLoader } from '@lib-commons/infrastructure/config/loaders/client.loader';
import { DatabasesLoader } from '@lib-commons/infrastructure/config/loaders/database.loader';
import { JwtLoader } from '@lib-commons/infrastructure/config/loaders/jwt.loader';
import { ServersLoader } from '@lib-commons/infrastructure/config/loaders/servers.loader';
import { UserRootLoader } from '@lib-commons/infrastructure/config/loaders/user-root.loader';
import { ConfigModuleOptions } from '@nestjs/config';
import { ConfigSchema } from '@app-auth/modules/main/infrastructure/config/schemas/config.schema';

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
