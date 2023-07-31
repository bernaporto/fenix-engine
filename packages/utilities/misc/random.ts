// ref: https://stackoverflow.com/a/27747377
export const randomCharacters = (length = 40): string => {
  const numbers = new Uint8Array(length / 2);
  crypto.getRandomValues(numbers);

  const chars = Array.from(numbers, (n) => n.toString(16).padStart(2, '0'));

  return chars.join('');
};
