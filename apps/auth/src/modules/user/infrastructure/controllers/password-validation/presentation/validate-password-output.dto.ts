interface IValidatePasswordOutputDto {
    validated: boolean;
  }
  
  export class ValidatePasswordOutputDto {
    readonly validated: boolean;
  
    constructor(validation: IValidatePasswordOutputDto) {
      this.validated = validation.validated;
    }
  }
  