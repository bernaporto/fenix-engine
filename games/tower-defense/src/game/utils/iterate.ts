export function* getGenerator<T>(list: T[]): Generator<T> {
  for (const item of list) {
    yield item;
  }
}

export const iterateOnList = <T>({
  handleItem,
  list,
  onceDone,
}: {
  handleItem: (item: T, proceed: VoidFunction) => void;
  list: T[];
  onceDone: VoidFunction;
}) => {
  const generator = getGenerator(list);

  const handleNext = () => {
    const { value, done } = generator.next();

    if (done) {
      onceDone();
      return;
    }

    if (value) {
      handleItem(value as T, handleNext);
    }
  };

  handleNext();
};
