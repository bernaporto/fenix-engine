// ref: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const splitmix32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x9e3779b9) | 0;
  let t = a ^ (a >>> 16);
  t = Math.imul(t, 0x21f0aaad);
  t = t ^ (t >>> 15);
  t = Math.imul(t, 0x735a2d97);
  return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
};

const getPRNG = () => {
  let seed = Date.now() * Math.random();
  let prng = splitmix32(seed);

  return {
    seed: {
      get: () => {
        return seed;
      },

      set: (value: number) => {
        seed = value;
        prng = splitmix32(value);
      },

      reset: () => {
        seed = Date.now() * Math.random();
        prng = splitmix32(seed);
      },
    },

    int: () => {
      return Math.floor(prng() * Number.MAX_SAFE_INTEGER);
    },

    float: () => {
      return prng();
    },

    range: (min: number, max: number) => {
      return Math.floor(prng() * (max - min) + min);
    },

    choices: <T>(array: T[]): T | null => {
      return array[Math.floor(prng() * array.length)] ?? null;
    },
  };
};

export const PRNG = getPRNG();
