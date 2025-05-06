import { registerDecorator, ValidationOptions } from 'class-validator';
import { regexHexObjectId } from '@core/infrastructure/helpers/regex';

export function IsObjectIdHex(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: string | string[]) {
          if (!value) {
            return false;
          }

          if (typeof value === 'string') {
            return regexHexObjectId.opt1.test(value) || regexHexObjectId.opt2.test(value);
          } else {
            return value.every((v) => regexHexObjectId.opt1.test(v) || regexHexObjectId.opt2.test(v));
          }
        },
        defaultMessage() {
          return 'The property ' + propertyName + ' must be a valid ObjectIdHex';
        },
      },
    });
  };
}
