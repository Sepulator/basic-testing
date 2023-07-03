import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const baseURL = 'https://jsonplaceholder.typicode.com';
const relativePath = '/posts/';
const mockResponse = { data: 'Mocked data' };

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValueOnce(axios);
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: baseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const responseData = await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(responseData).toEqual(mockResponse.data);
  });
});
