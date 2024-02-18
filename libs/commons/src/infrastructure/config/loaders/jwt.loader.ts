import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure/config/loaders/config.loader';
import { JwtType } from '@lib-commons/domain/contracts/types/var-environment-map/jwt/jwt.type';

export const JwtLoader = registerAs('jwt', (): JwtType => ConfigLoader().jwt);
