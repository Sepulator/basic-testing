// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';

const account = getBankAccount(100);
const toAccount = getBankAccount(50);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {});

  test('should throw error when transferring more than balance', () => {
    expect(() => account.withdraw(150)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    account.transfer(50, toAccount);
    expect(account.getBalance()).toBe(50);
    expect(toAccount.getBalance()).toBe(100);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(42);
    const balance = await account.fetchBalance();
    expect(balance).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(42);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
