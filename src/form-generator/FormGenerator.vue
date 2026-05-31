<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type {
  CheckboxFieldSchema,
  FieldSchema,
  FormData,
  FormSchema,
  FormValue,
  SelectFieldSchema,
  TextFieldSchema,
} from './types';
import { defaultValueFor, validateField } from './utils/validation';
import TextField from './fields/TextField.vue';
import SelectField from './fields/SelectField.vue';
import CheckboxField from './fields/CheckboxField.vue';

const props = defineProps<{
  schema: FormSchema;
  modelValue: FormData;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: FormData];
  submit: [value: FormData];
}>();

const touched = reactive<Record<string, boolean>>({});
const submitAttempted = ref(false);

watch(
  () => props.schema,
  () => {
    const next: FormData = {};
    for (const field of props.schema.fields) {
      next[field.model] =
        field.model in props.modelValue
          ? props.modelValue[field.model]
          : defaultValueFor(field);
    }
    emit('update:modelValue', next);
    Object.keys(touched).forEach((k) => delete touched[k]);
    submitAttempted.value = false;
  },
  { immediate: true },
);

function getValue(field: FieldSchema): FormValue {
  if (field.model in props.modelValue) return props.modelValue[field.model];
  return defaultValueFor(field);
}

function updateField(model: string, value: FormValue) {
  emit('update:modelValue', { ...props.modelValue, [model]: value });
}

function markTouched(model: string) {
  touched[model] = true;
}

const errors = computed<Record<string, string | null>>(() => {
  const result: Record<string, string | null> = {};
  for (const field of props.schema.fields) {
    const shouldShow = submitAttempted.value || touched[field.model];
    result[field.model] = shouldShow ? validateField(field, getValue(field)) : null;
  }
  return result;
});

const isValid = computed(() =>
  props.schema.fields.every((f) => validateField(f, getValue(f)) === null),
);

function handleSubmit() {
  submitAttempted.value = true;
  for (const f of props.schema.fields) touched[f.model] = true;
  if (isValid.value) {
    emit('submit', { ...props.modelValue });
  }
}

function handleReset() {
  const next: FormData = {};
  for (const field of props.schema.fields) {
    next[field.model] = defaultValueFor(field);
  }
  emit('update:modelValue', next);
  Object.keys(touched).forEach((k) => delete touched[k]);
  submitAttempted.value = false;
}

const fieldId = (model: string) => `fg-${model}`;

function isTextField(f: FieldSchema): f is TextFieldSchema {
  return f.type === 'text' || f.type === 'email' || f.type === 'password';
}
function isSelectField(f: FieldSchema): f is SelectFieldSchema {
  return f.type === 'select';
}
function isCheckboxField(f: FieldSchema): f is CheckboxFieldSchema {
  return f.type === 'checkbox';
}
</script>

<template>
  <form class="fg-form" novalidate @submit.prevent="handleSubmit">
    <div class="fg-form__fields">
      <template v-for="field in schema.fields" :key="field.model">
        <TextField
          v-if="isTextField(field)"
          :field="field"
          :model-value="(getValue(field) as string) ?? ''"
          :error="errors[field.model]"
          :field-id="fieldId(field.model)"
          @update:model-value="(v: string) => updateField(field.model, v)"
          @blur="markTouched(field.model)"
        />
        <SelectField
          v-else-if="isSelectField(field)"
          :field="field"
          :model-value="(getValue(field) as string) ?? ''"
          :error="errors[field.model]"
          :field-id="fieldId(field.model)"
          @update:model-value="(v: string) => updateField(field.model, v)"
          @blur="markTouched(field.model)"
        />
        <CheckboxField
          v-else-if="isCheckboxField(field)"
          :field="field"
          :model-value="Boolean(getValue(field))"
          :error="errors[field.model]"
          :field-id="fieldId(field.model)"
          @update:model-value="(v: boolean) => updateField(field.model, v)"
          @blur="markTouched(field.model)"
        />
      </template>
    </div>

    <div class="fg-form__actions">
      <button
        type="submit"
        class="fg-form__btn fg-form__btn--primary"
        :disabled="submitAttempted && !isValid"
      >
        {{ schema.submitLabel ?? 'Отправить' }}
      </button>
      <button type="button" class="fg-form__btn" @click="handleReset">
        {{ schema.resetLabel ?? 'Сбросить' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use './styles/tokens' as *;

.fg-form {
  display: flex;
  flex-direction: column;
  gap: $fg-space-5;
  font-family: $fg-font-sans;

  &__fields {
    display: flex;
    flex-direction: column;
    gap: $fg-space-5;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $fg-space-3;
  }

  &__btn {
    padding: $fg-space-3 $fg-space-5;
    border: 1px solid $fg-color-border-strong;
    border-radius: $fg-radius-md;
    background: $fg-color-surface;
    color: $fg-color-text;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, transform 0.05s ease;

    &:hover {
      background: $fg-color-text;
      color: $fg-color-surface;
    }

    &:active { transform: translateY(1px); }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.15);
    }

    &--primary {
      background: $fg-color-text;
      color: $fg-color-surface;

      &:hover {
        background: color.adjust($fg-color-text, $lightness: 12%);
      }

      &:disabled {
        background: $fg-color-text-muted;
        border-color: $fg-color-text-muted;
        cursor: not-allowed;
      }
    }
  }
}
</style>