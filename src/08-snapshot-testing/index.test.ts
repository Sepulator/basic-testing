import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const elements = [1, 2, 3, 4];
  const linkedList = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: {
          value: 4,
          next: { value: null, next: null },
        },
      },
    },
  };
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(elements)).toStrictEqual(linkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const result = generateLinkedList(elements);

    expect(result).toMatchSnapshot();
  });
});
