export interface IDisableActionOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DisableActionOutputDto implements IDisableActionOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDisableActionOutputDto) {
    this.success = root.success;
    this.message = `SubModule with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
