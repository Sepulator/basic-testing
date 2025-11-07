// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(cb, 1000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 1000);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 100);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(cb, 100);
    expect(setIntervalSpy).toHaveBeenCalledWith(cb, 100);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();

    doStuffByInterval(cb, 50);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(cb).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

describe('readFileAsynchronously', () => {
  const testPath = 'test.txt';
  const mockJoin = jest.spyOn(path, 'join');
  const mockExistsSync = jest.spyOn(fs, 'existsSync');
  const mockReadFile = jest.spyOn(fsPromises, 'readFile');
  const mockContent = 'Hello, World!';
  const mockBuffer = Buffer.from(mockContent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockJoin.mockReturnValue('/mock/path/test.txt');
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously(testPath);

    expect(mockJoin).toHaveBeenCalledWith(__dirname, testPath);
  });

  test('should return null if file does not exist', async () => {
    mockJoin.mockReturnValue('/mock/path/test.txt');
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(testPath);
    expect(result).toBeNull();
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockJoin.mockReturnValue('/mock/path/test.txt');
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(mockBuffer);

    const result = await readFileAsynchronously(testPath);

    expect(result).toBe(mockContent);
    expect(mockReadFile).toHaveBeenCalledWith('/mock/path/test.txt');
  });
});
