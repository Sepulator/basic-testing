import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackFn = jest.fn();

    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callbackFn, timeout);

    expect(setTimeout).toHaveBeenCalledWith(callbackFn, timeout);
  });

  test('should call callback only after timeout', () => {
    const callbackFn = jest.fn();

    doStuffByTimeout(callbackFn, timeout);
    expect(callbackFn).not.toBeCalled();

    jest.advanceTimersByTime(timeout);

    expect(callbackFn).toBeCalled();
    expect(callbackFn).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  const interval = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackFn = jest.fn();

    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackFn, interval);
    expect(setInterval).toHaveBeenCalledWith(callbackFn, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackFn = jest.fn();
    const quantity = 3;

    doStuffByInterval(callbackFn, interval);
    expect(callbackFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval * quantity);

    expect(callbackFn).toBeCalled();
    expect(callbackFn).toHaveBeenCalledTimes(quantity);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'file.txt';

  test('should call join with pathToFile', async () => {
    const join = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(await readFileAsynchronously(pathToFile)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Hello, RSSchool student';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(fileContent);

    expect(await readFileAsynchronously(pathToFile)).toBe(fileContent);
  });
});
