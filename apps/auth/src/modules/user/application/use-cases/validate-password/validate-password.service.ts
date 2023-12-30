import { IApplicationServiceQuery } from '@lib-commons/application';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidatePasswordQuery } from '@app-auth/modules/user/application/use-cases/validate-password/validate-password.query';
import { JSON_WEB_TOKEN_SERVICE, USER_REPOSITORY } from '@app-auth/modules/user/application/constants/injection-tokens';
import { IUserRepository } from '@app-auth/modules/user/domain';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtType } from '@lib-commons/domain';
import { IJsonWebTokenService } from '@app-auth/modules/common/domain/contracts/json-web-token.service.contract';
import { IPayloadTokenDecodedType } from '@app-auth/modules/common/domain/payload-token-decoded.type';

@Injectable()
export class ValidatePasswordService implements IApplicationServiceQuery<ValidatePasswordQuery> {
  constructor(
    @Inject(JSON_WEB_TOKEN_SERVICE)
    private readonly jsonWebTokenService: IJsonWebTokenService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly config: ConfigService,
  ) {}

  public async process<T extends ValidatePasswordQuery>(query: T): Promise<boolean> {
    try {
      const { token, password } = query;
      let validated: boolean = true;

      const { secret } = this.config.get<JwtType>('jwt') as JwtType;
      const tokenWithoutBearer = token.replace('Bearer ', '');
      const decodedToken = this.jsonWebTokenService.verify<IPayloadTokenDecodedType>(tokenWithoutBearer, secret);

      if (!(decodedToken instanceof Object)) {
        throw new UnauthorizedException('Invalid Token');
      }

      const user = await this.userRepository.getByEmailOrUsernameOrFail(decodedToken.email);
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        validated = false;
      }

      return validated;
    } catch (error) {
      throw new BadRequestException(error.message, error.name);
    }
  }
}
