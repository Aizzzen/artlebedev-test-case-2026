import type { FieldSchema, FormValue } from '../types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(field: FieldSchema, value: FormValue): string | null {
  if (field.type === 'checkbox') {
    if (field.required && value !== true) {
      return 'Это поле обязательно для подтверждения';
    }
    return null;
  }

  const raw = value == null ? '' : String(value);
  const trimmed = raw.trim();

  if (field.required && trimmed === '') {
    return 'Это поле обязательно';
  }

  if (trimmed === '') return null;

  if (field.type === 'email' && !EMAIL_RE.test(trimmed)) {
    return 'Введите корректный email';
  }

  if (field.type === 'text' || field.type === 'email' || field.type === 'password') {
    if (typeof field.minLength === 'number' && trimmed.length < field.minLength) {
      return `Минимум ${field.minLength} символ${pluralize(field.minLength)}`;
    }
    if (typeof field.maxLength === 'number' && trimmed.length > field.maxLength) {
      return `Максимум ${field.maxLength} символ${pluralize(field.maxLength)}`;
    }
    if (field.pattern) {
      try {
        const re = new RegExp(field.pattern);
        if (!re.test(trimmed)) {
          return field.patternMessage ?? 'Значение не соответствует формату';
        }
      } catch {
        return 'Некорректное выражение';
      }
    }
  }

  return null;
}

function pluralize(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return '';
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'а';
  return 'ов';
}

export function defaultValueFor(field: FieldSchema): FormValue {
  if (field.type === 'checkbox') return false;
  return '';
}