import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@management-commons/infrastructure/config/loaders/config.loader';
import { UserRootType } from '@management-commons/domain/contracts/types/var-environment-map/user-root/user-root.type';

export const UserRootLoader = registerAs(
  'userRoot',
  (): UserRootType => ConfigLoader().userRoot,
);
