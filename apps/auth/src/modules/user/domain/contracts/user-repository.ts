import { User } from '@app-auth/modules/user/domain';

export interface IUserRepository {
  getByEmailOrUsernameOrFail(email: string): Promise<User>;
  persist(user: User): Promise<void>;
  findUserRoot(): Promise<User | null>;
}
