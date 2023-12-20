import { IApplicationServiceQuery } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { ValidatePasswordQuery, USER_REPOSITORY } from '@app-auth/modules/user/application';
import { IUserRepository } from '@app-auth/modules/user/domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidatePasswordService implements IApplicationServiceQuery<ValidatePasswordQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  public async process<T extends ValidatePasswordQuery>(query: T): Promise<boolean> {
    const { email, password } = query;
    let validated: boolean = true;
    
    const user = await this.userRepository.getByEmailOrFail(email);
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      validated = false;
      // throw new UnauthorizedException('Invalid credentials');
    }

    return validated;
  }
}
