import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure';
import { JwtType } from '@lib-commons/domain';

export const JwtLoader = registerAs('jwt', (): JwtType => ConfigLoader().jwt);
