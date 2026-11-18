# Todo Next

Простой список дел на Next.js.

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

## Что умеет приложение

- Добавлять задачи и отмечать их выполненными.
- Редактировать задачу двойным щелчком. Enter сохраняет текст. Escape отменяет правку.
- Удалять задачу с подтверждением.
- Искать задачи и использовать фильтр вместе с поиском.
- Очищать поиск кнопкой ×.
- Сохранять список в браузере после обновления страницы.

## Карта проекта

| Файл | Описание |
| --- | --- |
| `app/page.tsx` | Задачи поиск и фильтр |
| `app/layout.tsx` | Разметка страницы |
| `app/globals.css` | Стили приложения |
| `package.json` | Команды и зависимости |
| `tsconfig.json` | Настройки TypeScript |

## Ошибки TypeScript в ветке types-homework

| Ошибка | Что значит | Причина |
| --- | --- | --- |
| `TS2551: Property 'don' does not exist on type 'Task'. Did you mean 'done'?` | У задачи нет поля `don`. | Опечатка вместо `done`. |
| `TS2345: Argument of type '"all-tasks"' is not assignable to parameter of type 'SetStateAction<Filter>'.` | Значение не подходит типу `Filter`. | Фильтр принимает только `all` `active` или `completed`. |
| `TS2345: Argument of type 'Task' is not assignable to parameter of type 'string'.` | Функция ждёт строку. | В `deleteTask` передали `task` вместо `task.id`. |
