/* eslint-disable @typescript-eslint/no-unused-vars */
export const removePropertyFromObject = <T, K extends keyof T>(obj: T, prop: K): Omit<T, K> => {
  const { [prop]: _, ...rest } = obj;

  return rest;
};
