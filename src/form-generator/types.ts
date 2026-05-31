export type TextFieldType = 'text' | 'email' | 'password';

export interface BaseField {
  label: string;
  model: string;
  required?: boolean;
  help?: string;
}

export interface TextFieldSchema extends BaseField {
  type: TextFieldType;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export type SelectOption = string | { label: string; value: string };

export interface SelectFieldSchema extends BaseField {
  type: 'select';
  options: SelectOption[];
  placeholder?: string;
}

export interface CheckboxFieldSchema extends BaseField {
  type: 'checkbox';
}

export type FieldSchema = TextFieldSchema | SelectFieldSchema | CheckboxFieldSchema;

export interface FormSchema {
  fields: FieldSchema[];
  submitLabel?: string;
  resetLabel?: string;
}

export type FormValue = string | boolean | null;
export type FormData = Record<string, FormValue>;