import { User } from '@module-user/domain/user';

export interface IUserRepository {
  getByEmailOrUsernameOrFail(email: string): Promise<User>;
  persist(user: User): Promise<void>;
  findUserRoot(): Promise<User | null>;
}
