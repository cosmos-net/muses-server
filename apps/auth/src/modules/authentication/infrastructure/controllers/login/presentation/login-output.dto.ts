export class LoginOutputDto {
  token: string;

  constructor(props: Partial<LoginOutputDto>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
