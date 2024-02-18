import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure/config/loaders/config.loader';
import { ClientType } from '@lib-commons/domain/contracts/types/var-environment-map/client/client.type';

export const ClientLoader = registerAs('client', (): ClientType => ConfigLoader().client);
