import { regexHexObjectId } from '@core/infrastructure/helpers/regex';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const removePropertyFromObject = <T, K extends keyof T>(obj: T, prop: K): Omit<T, K> => {
  const { [prop]: _, ...rest } = obj;

  return rest;
};

export const isObjectIdHex = (value: string): boolean => {
  if (!value) {
    return false;
  }

  return regexHexObjectId.opt1.test(value) || regexHexObjectId.opt2.test(value) || regexHexObjectId.opt3.test(value);
}
