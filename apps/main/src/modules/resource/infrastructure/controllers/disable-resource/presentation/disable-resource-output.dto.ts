export interface IDisableResourceOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DisableResourceOutputDto implements IDisableResourceOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDisableResourceOutputDto) {
    this.success = root.success;
    this.message = `Action with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
