# Todo Next

Простой список дел.

## Открыть приложение

[Нажми здесь чтобы открыть сайт](https://zverturetorig.github.io/todo-next/)

## Запуск на компьютере

```bash
npm install
npm run dev
```

## Возможности

- Добавление задач и отметка выполнения.
- Редактирование двойным щелчком. Enter сохраняет. Escape отменяет.
- Удаление с подтверждением.
- Поиск работает вместе с фильтром. Кнопка × очищает поиск.
- Список хранится в браузере после обновления страницы.

## Файлы проекта

- `app/page.tsx` — задачи поиск и фильтр.
- `app/layout.tsx` — разметка страницы.
- `app/globals.css` — стили.
- `package.json` — команды и зависимости.

## Ошибки TypeScript в ветке types-homework

- `TS2551: Property 'don' does not exist on type 'Task'. Did you mean 'done'?` — опечатка. Нужно `done`.
- `TS2345: Argument of type '"all-tasks"' is not assignable to parameter of type 'SetStateAction<Filter>'.` — фильтр не принимает `all-tasks`.
- `TS2345: Argument of type 'Task' is not assignable to parameter of type 'string'.` — передали задачу вместо её ID.
