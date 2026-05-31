<script setup lang="ts">
import { computed } from 'vue';
import type { CheckboxFieldSchema } from '../types';

const props = defineProps<{
  field: CheckboxFieldSchema;
  modelValue: boolean;
  error: string | null;
  fieldId: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  blur: [];
}>();

const checked = computed({
  get: () => Boolean(props.modelValue),
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
  <div class="fg-checkbox-field">
    <label :for="fieldId" class="fg-checkbox-field__row">
      <input
        :id="fieldId"
        v-model="checked"
        type="checkbox"
        :required="field.required || undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="fg-checkbox-field__input"
        @blur="emit('blur')"
      />
      <span class="fg-checkbox-field__box" :class="{ 'fg-checkbox-field__box--error': error }">
        <svg v-if="checked" class="fg-checkbox-field__check" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3 8.5l3.2 3.2L13 4.8"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="fg-checkbox-field__label">
        {{ field.label }}
        <span v-if="field.required" class="fg-checkbox-field__required" aria-hidden="true">*</span>
      </span>
    </label>

    <p v-if="field.help && !error" :id="`${fieldId}-help`" class="fg-checkbox-field__help">
      {{ field.help }}
    </p>
    <p v-if="error" :id="`${fieldId}-error`" class="fg-checkbox-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/tokens' as *;

.fg-checkbox-field {
  display: flex;
  flex-direction: column;
  gap: $fg-space-2;

  &__row {
    display: inline-flex;
    align-items: flex-start;
    gap: $fg-space-3;
    cursor: pointer;
    user-select: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  &__box {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    border: 1px solid $fg-color-border-strong;
    border-radius: $fg-radius-sm;
    background: $fg-color-surface;
    color: $fg-color-surface;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    margin-top: 1px;

    &--error { border-color: $fg-color-error; }
  }

  &__input:focus-visible + &__box {
    box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.15);
  }

  &__input:checked + &__box {
    background: $fg-color-text;
    border-color: $fg-color-text;
  }

  &__check { width: 14px; height: 14px; }
  &__label { font-size: 15px; line-height: 1.4; color: $fg-color-text; }
  &__required { color: $fg-color-accent; margin-left: 2px; }

  &__help, &__error { margin: 0 0 0 32px; font-size: 13px; }
  &__help { color: $fg-color-text-muted; }
  &__error { color: $fg-color-error; }
}
</style>