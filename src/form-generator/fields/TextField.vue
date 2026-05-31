<script setup lang="ts">
import { computed } from 'vue';
import type { TextFieldSchema } from '../types';

const props = defineProps<{
  field: TextFieldSchema;
  modelValue: string;
  error: string | null;
  fieldId: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.field.help) ids.push(`${props.fieldId}-help`);
  if (props.error) ids.push(`${props.fieldId}-error`);
  return ids.length ? ids.join(' ') : undefined;
});
</script>

<template>
  <div class="fg-text-field">
    <label :for="fieldId" class="fg-text-field__label">
      {{ field.label }}
      <span v-if="field.required" class="fg-text-field__required" aria-hidden="true">*</span>
    </label>

    <input
      :id="fieldId"
      v-model="value"
      :type="field.type"
      :placeholder="field.placeholder"
      :required="field.required || undefined"
      :minlength="field.minLength"
      :maxlength="field.maxLength"
      :pattern="field.pattern"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      autocomplete="off"
      class="fg-text-field__input"
      :class="{ 'fg-text-field__input--error': error }"
      @blur="emit('blur')"
    />

    <p v-if="field.help && !error" :id="`${fieldId}-help`" class="fg-text-field__help">
      {{ field.help }}
    </p>
    <p v-if="error" :id="`${fieldId}-error`" class="fg-text-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '../styles/tokens' as *;

.fg-text-field {
  display: flex;
  flex-direction: column;
  gap: $fg-space-2;

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: $fg-color-text;
  }

  &__required {
    color: $fg-color-accent;
    margin-left: 2px;
  }

  &__input {
    width: 100%;
    padding: $fg-space-3 $fg-space-4;
    border: 1px solid $fg-color-border;
    border-radius: $fg-radius-md;
    background: $fg-color-surface;
    font-size: 15px;
    line-height: 1.4;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder { color: $fg-color-text-muted; }

    &:hover:not(:focus) {
      border-color: color.adjust($fg-color-border, $lightness: -8%);
    }

    &:focus {
      outline: none;
      border-color: $fg-color-border-strong;
      box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
    }

    &--error {
      border-color: $fg-color-error;

      &:focus {
        border-color: $fg-color-error;
        box-shadow: 0 0 0 3px rgba(214, 40, 40, 0.12);
      }
    }
  }

  &__help { margin: 0; font-size: 13px; color: $fg-color-text-muted; }
  &__error { margin: 0; font-size: 13px; color: $fg-color-error; }
}
</style>