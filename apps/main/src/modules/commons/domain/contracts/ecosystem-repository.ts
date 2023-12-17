import { Ecosystem } from '@app-main/modules/ecosystem/domain';

export interface IEcosystemRepository {
  persist(model: Ecosystem): Promise<void>;
  byNameOrFail(name: string): Promise<Ecosystem>;
  byIdOrFail(id: string): Promise<Ecosystem>
}
