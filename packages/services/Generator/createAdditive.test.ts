import { createAdditive } from './createAdditive';

describe('createAdditive', () => {
  it('should return an object with a generate method and a rules object', () => {
    const generator = createAdditive();

    expect(generator).toEqual(
      expect.objectContaining({
        generate: expect.any(Function),
        rules: expect.objectContaining({
          register: expect.any(Function),
        }),
      })
    );
  });
});
