import type { FormSchema } from '../form-generator';

export interface SchemaPreset {
  id: string;
  title: string;
  description: string;
  schema: FormSchema;
}

export const presets: SchemaPreset[] = [
  {
    id: 'signup',
    title: 'Регистрация',
    description: 'Базовый пример из ТЗ: имя, email, пароль, роль, согласие',
    schema: {
      submitLabel: 'Зарегистрироваться',
      fields: [
        { type: 'text', label: 'Имя', model: 'name', required: true, placeholder: 'Иван' },
        { type: 'email', label: 'Email', model: 'email', required: true, placeholder: 'name@example.com' },
        { type: 'password', label: 'Пароль', model: 'password', required: true, minLength: 6, help: 'Минимум 6 символов' },
        {
          type: 'select', label: 'Роль', model: 'role', required: true,
          options: ['Админ', 'Пользователь'],
        },
        { type: 'checkbox', label: 'Согласен с условиями', model: 'terms', required: true },
      ],
    },
  },
  {
    id: 'feedback',
    title: 'Обратная связь',
    description: 'Без обязательных полей, с шаблоном и подсказкой',
    schema: {
      submitLabel: 'Отправить отзыв',
      fields: [
        { type: 'text', label: 'Имя', model: 'name', placeholder: 'Как к вам обращаться' },
        { type: 'email', label: 'Email для ответа', model: 'email' },
        {
          type: 'select', label: 'Тема', model: 'topic',
          options: [
            { label: 'Сообщить об ошибке', value: 'bug' },
            { label: 'Предложить улучшение', value: 'feature' },
            { label: 'Другое', value: 'other' },
          ],
        },
        {
          type: 'checkbox', label: 'Подписаться на новости', model: 'subscribe',
          help: 'Не чаще одного письма в месяц',
        },
      ],
    },
  },
  {
    id: 'advanced',
    title: 'С регуляркой',
    description: 'Демонстрация валидации по pattern и minLength/maxLength',
    schema: {
      submitLabel: 'Сохранить',
      fields: [
        {
          type: 'text', label: 'Логин', model: 'login', required: true,
          minLength: 3, maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$',
          patternMessage: 'Только латиница, цифры и _',
          placeholder: 'username',
        },
        {
          type: 'text', label: 'Телефон', model: 'phone', required: true,
          pattern: '^\\+?[0-9\\s\\-()]{7,}$',
          patternMessage: 'Введите номер телефона',
          placeholder: '+7 999 000-00-00',
        },
        {
          type: 'select', label: 'Страна', model: 'country', required: true,
          options: ['Россия', 'Беларусь', 'Казахстан', 'Армения'],
        },
      ],
    },
  },
];