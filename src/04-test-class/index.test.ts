// Uncomment the code below and write your tests
import _ from 'lodash';

import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  let bankAccount: BankAccount;
  let balance: number;
  let money: number;

  beforeEach(() => {
    balance = 333;
    money = 100;
    bankAccount = getBankAccount(balance);
  });

  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      bankAccount.withdraw(balance + money);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const transferToAccount = getBankAccount(0);
    expect(() => {
      bankAccount.transfer(balance + money, transferToAccount);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const transferToAccount = bankAccount;
    expect(() => {
      bankAccount.transfer(money, transferToAccount);
    }).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    bankAccount.deposit(money);
    expect(bankAccount.getBalance()).toBe(balance + money);
  });

  test('should withdraw money', () => {
    bankAccount.withdraw(money);
    expect(bankAccount.getBalance()).toBe(balance - money);
  });

  test('should transfer money', () => {
    const transferToAccount = getBankAccount(0);
    bankAccount.transfer(money, transferToAccount);
    expect(bankAccount.getBalance()).toBe(balance - money);
    expect(transferToAccount.getBalance()).toBe(money);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(_, 'random').mockImplementation(() => 1);
    await expect(bankAccount.fetchBalance()).resolves.toBe(1);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(_, 'random').mockImplementation(() => balance);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(_, 'random').mockImplementation(() => 0);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
