export interface IDeleteEcosystemOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DeleteEcosystemOutputDto implements IDeleteEcosystemOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDeleteEcosystemOutputDto) {
    this.success = root.success;
    this.message = `Ecosystem with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
