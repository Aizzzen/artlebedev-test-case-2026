# FormGenerator - Vue 3 генератор форм по JSON-схеме

Тестовое задание на позицию фронтендер-стажер в Студию Артемия Лебедева, 2026. Vue 3 компонент `FormGenerator`, который строит форму по переданной JSON-схеме. Поддерживает три типа полей (text/email/password, select, checkbox), валидацию и реактивный `v-model`.

```vue
<FormGenerator :schema="formSchema" v-model="formData" />
```

## Стек

- Vue 3 + Composition API + `<script setup>`
- TypeScript (strict)
- Scoped SCSS, без UI-библиотек
- Vite, ESLint, Prettier
- Dockerfile — для удобства запуска

## Перенос в другой проект

Компонент самодостаточен — лежит в одной папке `src/form-generator/`. Чтобы использовать его в другом проекте:

1. Скопировать папку `src/form-generator/` в свой `src/`.
2. Установить peer-зависимости: `npm i vue sass-embedded`.
3. Импортировать: `import { FormGenerator } from './form-generator';`

## Поддерживаемые поля

| `type`     | Дополнительно                                                         |
| ---------- | --------------------------------------------------------------------- |
| `text`     | `placeholder`, `minLength`, `maxLength`, `pattern`, `patternMessage`  |
| `email`    | то же + встроенная проверка формата                                   |
| `password` | то же что у `text`                                                    |
| `select`   | `options: string[]` или `{label, value}[]`, `placeholder`             |
| `checkbox` | `required` означает обязательное согласие                             |

Общие свойства любого поля: `label`, `model`, `required`, `help`.

## Пример схемы

```ts
const schema = {
  submitLabel: 'Зарегистрироваться',
  fields: [
    { type: 'text',     label: 'Имя',                 model: 'name',     required: true },
    { type: 'email',    label: 'Email',               model: 'email',    required: true },
    { type: 'password', label: 'Пароль',              model: 'password', required: true, minLength: 6 },
    { type: 'select',   label: 'Роль',                model: 'role',     required: true,
      options: ['Админ', 'Пользователь'] },
    { type: 'checkbox', label: 'Согласен с условиями', model: 'terms',   required: true },
  ],
};
```

## Валидация

Срабатывает на `blur` и при попытке submit:

- `required` — поле не пустое (для чекбокса — отмечено)
- `minLength` / `maxLength` — длина строки
- `pattern` — регулярное выражение; сообщение через `patternMessage`
- `type: 'email'` — проверка формата встроена

## Структура проекта

```
src/
├── form-generator/             ← компонент
│   ├── index.ts                
│   ├── FormGenerator.vue
│   ├── types.ts
│   ├── fields/
│   │   ├── TextField.vue
│   │   ├── SelectField.vue
│   │   └── CheckboxField.vue
│   ├── utils/
│   │   └── validation.ts
│   └── styles/
│       └── _tokens.scss
└── demo/                       ← демо-страница (не часть компонента)
    ├── App.vue
    ├── examples.ts
    ├── demo.scss
    └── main.ts
```

---

## Запуск

По ТЗ требовался только Vue компонент. Чтобы ревьюер мог быстро посмотреть демо без возни с окружением я добавил два способа запуска.

### Локально (через npm)

```bash
npm install
npm run dev
```

Откроется на <http://localhost:5173>.

Прочие команды:

```bash
npm run build       # production-сборка в dist/
npm run preview     # предпросмотр собранного приложения
npm run lint        # ESLint --fix
npm run format      # Prettier
npm run type-check  # vue-tsc без эмита
```

### Через Docker

```bash
docker build -t artlebedev-test-case-2026 .
docker run --rm -p 8080:80 artlebedev-test-case-2026
```

Откройте <http://localhost:8080>.