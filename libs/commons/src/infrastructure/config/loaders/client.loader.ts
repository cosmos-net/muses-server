import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure';
import { ClientType } from '@lib-commons/domain';

export const ClientLoader = registerAs('client', (): ClientType => ConfigLoader().client);
