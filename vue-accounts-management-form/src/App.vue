<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-grey-1">
        <AccountForm />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AccountForm from './components/AccountForm.vue'
</script>

<style lang="scss" scoped>
body {
  background-color: $default-background;
}
</style>
