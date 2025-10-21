import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account } from '../types/account'
import { v4 as uuidv4 } from 'uuid'
import { parseLabels } from '@/utils/labels'

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
      labels: [],
      type: 'Локальная',
      login: '',
      password: '',
    }
    accounts.value.push(newAccount)
    saveToLocalStorage()
    return newAccount.id
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
    saveToLocalStorage()
  }

  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex((acc) => acc.id === updatedAccount.id)
    if (index !== -1) {
      const labelsArray = parseLabels(updatedAccount.label)
      if (updatedAccount.type === 'LDAP') {
        updatedAccount.password = null
      }
      accounts.value[index] = {
        ...updatedAccount,
        labels: labelsArray,
      }
      saveToLocalStorage()
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('accounts-store', JSON.stringify(accounts.value))
  }

  watch(
    accounts,
    () => {
      saveToLocalStorage()
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
