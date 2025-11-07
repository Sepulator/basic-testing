// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockAxiosCreate = jest.fn();
  const mockAxiosGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockAxiosCreate.mockReturnValue({
      get: mockAxiosGet,
    });

    axios.create = mockAxiosCreate;
  });

  test('should create instance with provided base url', async () => {
    mockAxiosGet.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/users/1');

    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockAxiosGet.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/users/1');

    expect(mockAxiosGet).toHaveBeenCalledWith('/users/1');
  });

  test('should return response data', async () => {
    const expectedData = { id: 1, title: 'Test Post' };
    mockAxiosGet.mockResolvedValue({ data: expectedData });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(expectedData);
  });
});
