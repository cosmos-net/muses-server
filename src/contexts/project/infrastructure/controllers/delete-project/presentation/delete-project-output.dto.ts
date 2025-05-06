export interface IDeleteProjectOutputDto {
  readonly success: boolean;
  readonly message?: string;
  readonly id?: string;
}

export class DeleteProjectOutputDto implements IDeleteProjectOutputDto {
  readonly success: boolean;
  readonly message: string;

  constructor(root: IDeleteProjectOutputDto) {
    this.success = root.success;
    this.message = `Ecosystem with id ${root.id} has ${root.success ? 'been' : 'not been'} deleted`;
  }
}
