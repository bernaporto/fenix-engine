import { isNullable, isValidObject } from './type';

export const getErrorMessage = (error: unknown): string => {
  if (isNullable(error)) {
    return 'Unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (
    isValidObject(error) &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    let message = error.message;

    if ('code' in error) {
      message = `${error.code}: ${message}`;
    }

    return message;
  }

  return JSON.stringify(error);
};
