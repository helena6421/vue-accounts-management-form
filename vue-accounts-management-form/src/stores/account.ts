import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types/account';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  const addAccount = (account: Account) => {
    accounts.value.push(account);
  };

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  };

  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts.value[index] = updatedAccount;
    }
  };

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
  };
});