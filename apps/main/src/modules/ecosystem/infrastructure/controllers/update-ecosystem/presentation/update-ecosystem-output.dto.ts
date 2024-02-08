interface IUpdateEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class UpdateEcosystemOutputDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string;

  constructor(ecosystem: IUpdateEcosystemOutputDto) {
    this.id = ecosystem.id;
    this.name = ecosystem.name;
    this.description = ecosystem.description;
    this.enabled = ecosystem.enabled;
    this.createdAt = ecosystem.createdAt.toISOString();
    this.updatedAt = ecosystem.updatedAt.toISOString();
    if (ecosystem.deletedAt !== undefined) this.deletedAt = ecosystem.deletedAt.toISOString();
  }
}
