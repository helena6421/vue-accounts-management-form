<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4 q-my-none">Управление учетными записями</h1>
      <q-btn icon="add" color="primary" label="Добавить учетную запись" @click="addNewAccount" />
    </div>

    <q-card v-if="accountsStore.accounts.length" class="q-mb-md">
      <q-card-section class="bg-blue-1">
        <div class="text-caption">
          <q-icon name="info" color="primary" size="36px" class="q-mr-sm" />
          Для указания нескольких меток для одной пары логин/пароль используйте разделитель
          <code>;</code>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-else>
      <q-card-section class="text-center text-grey">
        <div>Нет учетных записей. Нажмите "Добавить учетную запись" чтобы создать первую.</div>
      </q-card-section>
    </q-card>

    <div v-for="account in accountsStore.accounts" :key="account.id" class="q-mb-md">
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">Учетная запись</div>
            <q-btn icon="delete" color="negative" flat @click="removeAccount(account.id)" />
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                clearable
                v-model="account.label"
                label="Метки"
                :error="getValidationState(account.id)?.isLabelValid"
                error-message="Максимум 50 символов"
                @blur="updateAccount(account)"
              >
                <template v-slot:hint>
                  Символов: {{ account.label?.length || 0 }}/50
                  <span v-if="(account.label?.length || 0) > 50" class="text-negative">
                    • Превышено на {{ (account.label?.length || 0) - 50 }} символов
                  </span>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                v-model="account.type"
                :options="accountTypes"
                label="Тип записи *"
                emit-value
                map-options
                @update:model-value="updateAccount(account)"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                clearable
                v-model="account.login"
                label="Логин *"
                :error="getValidationState(account.id)?.isLoginValid"
                error-message="Обязательное поле"
                @blur="updateAccount(account)"
              >
                <template v-slot:hint>
                  Символов: {{ account.login?.length || 0 }}/100
                  <span v-if="(account.login?.length || 0) > 100" class="text-negative">
                    • Превышено на {{ (account.login?.length || 0) - 100 }} символов
                  </span>
                </template>
              </q-input>
            </div>

            <div class="col-12" v-if="account.type === 'Локальная'">
              <q-input
                clearable
                v-model="account.password"
                label="Пароль *"
                :type="showPassword[account.id] ? 'text' : 'password'"
                :error="getValidationState(account.id)?.isPasswordValid"
                error-message="Обязательное поле"
                @blur="updateAccount(account)"
              >
                <template v-slot:hint>
                  Символов: {{ account.password?.length || 0 }}/100
                  <span v-if="(account.password?.length || 0) > 100" class="text-negative">
                    • Превышено на {{ (account.password?.length || 0) - 100 }} символов
                  </span>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword[account.id] ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showHidePassword(account.id)"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { useAccountsStore } from '../stores/account'
import { validateLogin, validatePassword, validateLabel } from '@/utils/validation'
import type { Account } from '../types/account'

const accountsStore = useAccountsStore()

interface ValidationState {
  isLoginValid: boolean
  isPasswordValid: boolean
  isLabelValid: boolean
  isTypeValid: boolean
}

const validationStates = reactive<Record<string, ValidationState>>({})

const showPassword = reactive<Record<string, boolean>>({})

const accountTypes = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

const validateType = (type: string): boolean => {
  return type === 'Локальная' || type === 'LDAP'
}

const getValidationState = (accountId: string): ValidationState => {
  if (!validationStates[accountId]) {
    validationStates[accountId] = {
      isLoginValid: false,
      isPasswordValid: false,
      isLabelValid: false,
      isTypeValid: false,
    }
  }
  return validationStates[accountId]
}

const validateAllAccounts = () => {
  accountsStore.accounts.forEach((account) => {
    const validationState = getValidationState(account.id)

    validationState.isLoginValid = !validateLogin(account.login)
    validationState.isPasswordValid = !validatePassword(account.password, account.type)
    validationState.isLabelValid = !validateLabel(account.label)
    validationState.isTypeValid = !validateType(account.type)
  })
}

const addNewAccount = () => {
  const accountId = accountsStore.addAccount()
  getValidationState(accountId)
}

const removeAccount = (id: string) => {
  accountsStore.removeAccount(id)
  delete validationStates[id]
  delete showPassword[id]
}

const showHidePassword = (accountId: string) => {
  showPassword[accountId] = !showPassword[accountId]
}

const updateAccount = (account: Account) => {
  const validationState = getValidationState(account.id)

  validationState.isLoginValid = !validateLogin(account.login)
  validationState.isPasswordValid = !validatePassword(account.password, account.type)
  validationState.isLabelValid = !validateLabel(account.label)
  validationState.isTypeValid = !validateType(account.type)

  const isLoginValid = validationState.isLoginValid === false
  const isPasswordValid = validationState.isPasswordValid === false
  const isTypeValid = validationState.isTypeValid === false
  const isLabelValid = validationState.isLabelValid === false

  if (account.type === 'Локальная') {
    if (isLoginValid && isPasswordValid && isTypeValid && isLabelValid) {
      accountsStore.updateAccount(account)
    }
  } else {
    if (isLoginValid && isTypeValid && isLabelValid) {
      accountsStore.updateAccount(account)
    }
  }
}

onMounted(() => {
  validateAllAccounts()
})

watch(
  () => accountsStore.accounts,
  () => {
    validateAllAccounts()
  },
  { deep: true },
)
</script>
