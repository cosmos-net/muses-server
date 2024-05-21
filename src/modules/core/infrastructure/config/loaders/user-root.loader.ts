import { registerAs } from '@nestjs/config';
import { UserRootType } from '@core/domain/contracts/types/var-environment-map/user-root/user-root.type';
import { ConfigLoader } from '@core/infrastructure/config/loaders/config.loader';

export const UserRootLoader = registerAs('userRoot', (): UserRootType => ConfigLoader().userRoot);
