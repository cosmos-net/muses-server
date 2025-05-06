export interface IDisableModuleOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DisableModuleOutputDto implements IDisableModuleOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDisableModuleOutputDto) {
    this.success = root.success;
    this.message = `Module with id ${root.id} has ${root.success ? 'been' : 'not been'} Disabled`;
  }
}
