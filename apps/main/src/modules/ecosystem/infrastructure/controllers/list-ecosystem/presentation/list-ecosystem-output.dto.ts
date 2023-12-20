interface IUpdateEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
}

export class ListEcosystemOutputDto {
  items: IUpdateEcosystemOutputDto[] = [];

  constructor(ecosystems: IUpdateEcosystemOutputDto[]) {
    this.items = ecosystems.map<IUpdateEcosystemOutputDto>((ecosystem) => ({
      id: ecosystem.id,
      name: ecosystem.name,
      description: ecosystem.description,
      enabled: ecosystem.enabled,
      createdAt: ecosystem.createdAt instanceof Date ? ecosystem.createdAt.toISOString() : ecosystem.createdAt,
      updatedAt: ecosystem.updatedAt instanceof Date ? ecosystem.updatedAt.toISOString() : ecosystem.updatedAt,
      deletedAt: ecosystem.deletedAt instanceof Date ? ecosystem.deletedAt.toISOString() : ecosystem.deletedAt,
    }));
  }
}
