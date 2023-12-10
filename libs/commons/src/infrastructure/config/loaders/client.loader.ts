
import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@management-commons/infrastructure/config/loaders/config.loader';
import { ClientType } from '@management-commons/domain/contracts/types/client/client.type';

export const ClientLoader = registerAs(
  'client',
  (): ClientType => ConfigLoader().client,
);
