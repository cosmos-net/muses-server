export interface IEncrypterService {
  withHash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
}
