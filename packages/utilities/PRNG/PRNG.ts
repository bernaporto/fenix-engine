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

export type TPRNG = {
  seed: {
    get: () => number;
    set: (value: number) => void;
    reset: () => void;
  };

  int: () => number;
  float: () => number;
  rangeInt: (min: number, max: number) => number;
  rangeFloat: (min: number, max: number) => number;
  choices: <T>(array: T[]) => T | null;
};

const getPRNG = (): TPRNG => {
  let seed = Date.now() * Math.random();
  let prng = splitmix32(seed);

  const self: TPRNG = {
    seed: {
      get: () => {
        return seed;
      },

      set: (value) => {
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

    rangeInt: (min, max) => {
      return Math.floor(self.rangeFloat(min, max));
    },

    rangeFloat: (min, max) => {
      return prng() * (max - min) + min;
    },

    choices: <T>(array: T[]): T | null => {
      return array[Math.floor(prng() * array.length)] ?? null;
    },
  };

  return self;
};

export const PRNG = {
  create: (seed?: number) => {
    const prng = getPRNG();
    if (seed !== undefined) {
      prng.seed.set(seed);
    }

    return prng;
  },
  default: getPRNG(),
};
