import { Solution } from '../src/Solution';

describe('Solution', () => {
  describe('check()', () => {
    let sortedArray: Array<string>;
    beforeEach(() => {
      sortedArray = ["f319", "46ec", "c1c7", "3720", "c7df", "c4ea", "4e3e", "80fd"];
      const checkIfConsecutiveMock = jest.fn(
        async (
          firstString: string,
          secondString: string,
          token:string): Promise<boolean> => {
            return sortedArray.indexOf(firstString) + 1 === sortedArray.indexOf(secondString);
        }
      );

      Solution.checkIfConsecutive = checkIfConsecutiveMock;
    });

    test('should return an empty array when array of blocks is empty', async () => {
      const result = await Solution.check([], 'token');
      expect(result).toEqual([]);
    });

    test('should return the sorted array', async () => {
      const unsortedArray = ["f319", "80fd", "c4ea", "3720", "46ec", "c1c7", "4e3e", "c7df"];
      const result = await Solution.check(unsortedArray, 'fake-token');

      expect(result).toEqual(sortedArray);
    });
  });
})
