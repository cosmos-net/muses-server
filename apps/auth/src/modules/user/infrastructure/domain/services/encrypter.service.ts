import { IEncrypterService } from '@module-user/domain/contracts/encrypter-service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncrypterService implements IEncrypterService {
  async withHash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    const encrypted = await bcrypt.hash(data, saltOrRounds);

    return encrypted;
  }
}
