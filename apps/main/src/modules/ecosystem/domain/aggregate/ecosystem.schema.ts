export interface IEcosystemSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  projects: string[] | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
