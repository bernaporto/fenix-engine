import { getErrorMessage } from './error';

describe('getErrorMessage', () => {
  it('should return "Unknown error" if error is null or undefined', () => {
    expect(getErrorMessage(null)).toBe('Unknown error');
    expect(getErrorMessage(undefined)).toBe('Unknown error');
  });

  it('should return exact value if error is string', () => {
    expect(getErrorMessage('error message')).toBe('error message');
  });

  it('should return error.message if error is object and has message property', () => {
    expect(getErrorMessage({ message: 'error message' })).toBe('error message');
  });

  it('should return error.code: error.message if error is object and has code property', () => {
    expect(getErrorMessage({ code: '404', message: 'error message' })).toBe(
      '404: error message',
    );
  });

  it('should return JSON.stringify(error) if error is object and has no message property', () => {
    expect(getErrorMessage({})).toBe('{}');
  });
});
