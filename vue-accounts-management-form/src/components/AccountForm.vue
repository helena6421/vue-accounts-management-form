<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4 q-my-none">Управление учетными записями</h1>
      <q-btn icon="add" color="primary" label="Добавить учетную запись" @click="addNewAccount" />
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Список учетных записей</div>
        <div class="text-caption text-grey">Для добавления учетной записи нажмите кнопку "+"</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
const addNewAccount = () => {
  console.log('Add account functionality will be implemented')
}
</script>
