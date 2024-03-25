import { createAdditive } from './createAdditive';
import { createSubtractive } from './createSubtractive';

const Generator = {
  additive: {
    create: createAdditive,
  },
  subtractive: {
    create: createSubtractive,
  },
};

export default Generator;
