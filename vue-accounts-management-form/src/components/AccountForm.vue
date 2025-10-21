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
                v-model="account.label"
                label="Метки"
                hint="Максимум 50 символов"
                :maxlength="50"
                :error="!validateLabel(account.label)"
                error-message="Максимум 50 символов"
                @blur="updateAccount(account)"
              />
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
                :maxlength="100"
                :error="!validateLogin(account.login)"
                error-message="Обязательное поле, максимум 100 символов"
                @blur="updateAccount(account)"
              />
            </div>

            <div class="col-12" v-if="account.type === 'Локальная'">
              <q-input
                clearable
                v-model="account.password"
                label="Пароль *"
                :type="isPasswordVisible ? 'text' : 'password'"
                :maxlength="100"
                :error="!validatePassword(account.password, account.type)"
                error-message="Обязательное поле, максимум 100 символов"
                @blur="updateAccount(account)"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
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
import { useAccountsStore } from '../stores/account'
import { validateLogin, validatePassword, validateLabel } from '@/utils/validation'
import type { Account } from '../types/account'
import { ref } from 'vue'

const accountsStore = useAccountsStore()

const isPasswordVisible = ref(false)

const accountTypes = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

const addNewAccount = () => {
  accountsStore.addAccount()
}

const removeAccount = (id: string) => {
  accountsStore.removeAccount(id)
}

const updateAccount = (account: Account) => {
  const isLoginValid = validateLogin(account.login)
  const isPasswordValid = validatePassword(account.password, account.type)
  const isLabelValid = validateLabel(account.label)

  if (isLoginValid && isPasswordValid && isLabelValid) {
    accountsStore.updateAccount(account)
  }
}
</script>
