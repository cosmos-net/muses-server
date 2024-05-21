interface IRetrieveEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}

export class RetrieveEcosystemOutputDto implements IRetrieveEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: IRetrieveEcosystemOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.isEnabled = root.isEnabled;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
