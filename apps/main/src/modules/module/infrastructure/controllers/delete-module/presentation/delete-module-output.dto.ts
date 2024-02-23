export interface IDeleteModuleOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DeleteModuleOuputDto implements IDeleteModuleOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDeleteModuleOutputDto) {
    this.success = root.success;
    this.message = `Module with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
