import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@core/infrastructure/config/loaders/config.loader';
import { JwtType } from '@core/domain/contracts/types/var-environment-map/jwt/jwt.type';

export const JwtLoader = registerAs('jwt', (): JwtType => ConfigLoader().jwt);
