import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure';
import { UserRootType } from '@lib-commons/domain';

export const UserRootLoader = registerAs(
  'userRoot',
  (): UserRootType => ConfigLoader().userRoot,
);
