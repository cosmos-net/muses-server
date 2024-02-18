import { registerAs } from '@nestjs/config';
import { UserRootType } from '@lib-commons/domain/contracts/types/var-environment-map/user-root/user-root.type';
import { ConfigLoader } from '@lib-commons/infrastructure/config/loaders/config.loader';

export const UserRootLoader = registerAs('userRoot', (): UserRootType => ConfigLoader().userRoot);
