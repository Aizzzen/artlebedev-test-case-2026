<script setup lang="ts">
import { computed } from 'vue';
import type { SelectFieldSchema, SelectOption } from '../types';

const props = defineProps<{
  field: SelectFieldSchema;
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

interface NormalizedOption { label: string; value: string }

const normalizedOptions = computed<NormalizedOption[]>(() =>
  props.field.options.map((opt: SelectOption) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt,
  ),
);

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.field.help) ids.push(`${props.fieldId}-help`);
  if (props.error) ids.push(`${props.fieldId}-error`);
  return ids.length ? ids.join(' ') : undefined;
});
</script>

<template>
  <div class="fg-select-field">
    <label :for="fieldId" class="fg-select-field__label">
      {{ field.label }}
      <span v-if="field.required" class="fg-select-field__required" aria-hidden="true">*</span>
    </label>

    <div class="fg-select-field__wrapper">
      <select
        :id="fieldId"
        v-model="value"
        :required="field.required || undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="fg-select-field__control"
        :class="{ 'fg-select-field__control--error': error }"
        @blur="emit('blur')"
      >
        <option value="" disabled>{{ field.placeholder ?? 'Не выбрано' }}</option>
        <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <span class="fg-select-field__chevron" aria-hidden="true">▾</span>
    </div>

    <p v-if="field.help && !error" :id="`${fieldId}-help`" class="fg-select-field__help">
      {{ field.help }}
    </p>
    <p v-if="error" :id="`${fieldId}-error`" class="fg-select-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '../styles/tokens' as *;

.fg-select-field {
  display: flex;
  flex-direction: column;
  gap: $fg-space-2;

  &__label { font-size: 14px; font-weight: 500; color: $fg-color-text; }
  &__required { color: $fg-color-accent; margin-left: 2px; }
  &__wrapper { position: relative; }

  &__control {
    width: 100%;
    padding: $fg-space-3 $fg-space-6 $fg-space-3 $fg-space-4;
    border: 1px solid $fg-color-border;
    border-radius: $fg-radius-md;
    background: $fg-color-surface;
    color: $fg-color-text;
    font-size: 15px;
    line-height: 1.4;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

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

  &__chevron {
    position: absolute;
    right: $fg-space-4;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $fg-color-text-muted;
    font-size: 12px;
  }

  &__help { margin: 0; font-size: 13px; color: $fg-color-text-muted; }
  &__error { margin: 0; font-size: 13px; color: $fg-color-error; }
}
</style>