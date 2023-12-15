import { Ecosystem } from '@management-main/modules/ecosystem/domain/ecosystem';

export interface IEcosystemRepository {
  persist(model: Ecosystem): Promise<void>;
  byNameOrFail(name: string): Promise<Ecosystem>;
  byIdOrFail(id: string): Promise<Ecosystem>
}
