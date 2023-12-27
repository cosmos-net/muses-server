export interface IAuthModuleFacadeService {
  getUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<{ id: number; uuid: string; roles: string[]; password: string; username: string; email: string }>;
}
