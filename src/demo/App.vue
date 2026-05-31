<script setup lang="ts">
import { ref } from 'vue';
import { FormGenerator } from '../form-generator';
import type { FormData, FormSchema } from '../form-generator';

const schema: FormSchema = {
  submitLabel: 'Зарегистрироваться',
  fields: [
    { type: 'text', label: 'Имя', model: 'name', required: true },
    { type: 'email', label: 'Email', model: 'email', required: true },
    { type: 'password', label: 'Пароль', model: 'password', required: true, minLength: 6 },
    {
      type: 'select',
      label: 'Роль',
      model: 'role',
      options: ['Админ', 'Пользователь'],
      required: true,
    },
    { type: 'checkbox', label: 'Согласен с условиями', model: 'terms', required: true },
  ],
};

const formData = ref<FormData>({});
</script>

<template>
  <main class="demo">
    <h1 class="demo__title">FormGenerator</h1>
    <FormGenerator :schema="schema" v-model="formData" />
  </main>
</template>

<style scoped>
.demo {
  max-width: 480px;
  margin: 40px auto;
  padding: 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}
.demo__title {
  font-size: 24px;
  margin: 0 0 24px;
}
</style>