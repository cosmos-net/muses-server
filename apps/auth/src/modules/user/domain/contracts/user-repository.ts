import { User } from '@app-auth/modules/user/domain';

export interface IUserRepository {
  getByEmailOrFail(email: string): Promise<User>;
  persist(user: User): Promise<void>;
}
