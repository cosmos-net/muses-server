export interface IDeleteSubModuleOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DeleteSubModuleOutputDto implements IDeleteSubModuleOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDeleteSubModuleOutputDto) {
    this.success = root.success;
    this.message = `SubModule with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
