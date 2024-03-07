import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsObjectIdHex(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          const regex2 = /^[0-9a-f]{24}$/i;

          return regex.test(value) || regex2.test(value);
        },
        defaultMessage() {
          return 'The property ' + propertyName + ' must be a valid ObjectIdHex';
        },
      },
    });
  };
}
