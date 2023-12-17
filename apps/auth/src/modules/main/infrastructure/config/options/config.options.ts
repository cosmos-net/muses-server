import { ConfigModuleOptions } from '@nestjs/config';
import { ConfigSchema } from '@app-main/modules/main/infrastructure';
import { ServersLoader, DatabasesLoader, UserRootLoader, JwtLoader, ClientLoader } from '@lib-commons/infrastructure';

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
