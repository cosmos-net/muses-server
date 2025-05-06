export interface IDisableEcosystemOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DisableEcosystemOutputDto implements IDisableEcosystemOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDisableEcosystemOutputDto) {
    this.success = root.success;
    this.message = `Ecosystem with id ${root.id} has ${root.success ? 'been' : 'not been'} disabled`;
  }
}
