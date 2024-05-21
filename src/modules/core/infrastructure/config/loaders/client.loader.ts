import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@core/infrastructure/config/loaders/config.loader';
import { ClientType } from '@core/domain/contracts/types/var-environment-map/client/client.type';

export const ClientLoader = registerAs('client', (): ClientType => ConfigLoader().client);
