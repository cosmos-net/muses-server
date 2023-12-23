import { IApplicationServiceQuery } from '@lib-commons/application';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidatePasswordQuery, USER_REPOSITORY } from '@app-auth/modules/user/application';
import { IUserRepository } from '@app-auth/modules/user/domain';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtType } from '@lib-commons/domain';

@Injectable()
export class ValidatePasswordService implements IApplicationServiceQuery<ValidatePasswordQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private readonly config: ConfigService
  ) { }

  public async process<T extends ValidatePasswordQuery>(query: T): Promise<boolean> {
    try {
      const { token, password } = query;
      let validated: boolean = true;

      const { secret } = this.config.get<JwtType>('jwt') as JwtType;

      const tokenWithoutBearer = token.replace('Bearer ', '');

      const decodedToken = jwt.verify(tokenWithoutBearer, secret) as jwt.JwtPayload;

      if (!decodedToken.sub) {
        throw new UnauthorizedException('Invalid Token');
      }

      const claims = JSON.parse(decodedToken.sub);

      const user = await this.userRepository.getByEmailOrFail(claims.email);

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
