import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account } from '../types/account'
import { v4 as uuidv4 } from 'uuid'

export const useAccountsStore = defineStore('accounts', () => {
  const savedAccounts = localStorage.getItem('accounts-store')
  const accounts = ref<Account[]>(savedAccounts ? JSON.parse(savedAccounts) : [])

  const generateId = (): string => {
    return uuidv4()
  }

  const addAccount = () => {
    const newAccount: Account = {
      id: generateId(),
      label: '',
      type: 'Локальная',
      login: '',
      password: '',
    }
    accounts.value.push(newAccount)
    return newAccount.id
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex((acc) => acc.id === updatedAccount.id)
    if (index !== -1) {
      accounts.value[index] = updatedAccount
    }
  }

  watch(
    accounts,
    (newAccounts) => {
      localStorage.setItem('accounts-store', JSON.stringify(newAccounts))
    },
    { deep: true },
  )

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
  }
})
