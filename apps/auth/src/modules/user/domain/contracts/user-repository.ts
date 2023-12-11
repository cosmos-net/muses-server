import { User } from '@management-auth/modules/user/domain/user';

export interface IUserRepository {
  getByEmailOrFail(email: string): Promise<User>;
  persist(user: User): Promise<void>;
}
