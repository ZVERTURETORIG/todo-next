"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";
const STORAGE_KEY = "todo-next-tasks";

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return typeof task.id === "string" && typeof task.text === "string" && typeof task.done === "boolean";
}

const filters: { label: string; value: Filter }[] = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Выполненные", value: "completed" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    try {
      const storedTasks = window.localStorage.getItem(STORAGE_KEY);
      if (!storedTasks) return;

      const parsedTasks: unknown = JSON.parse(storedTasks);
      if (Array.isArray(parsedTasks)) {
        setTasks(parsedTasks.filter(isTask));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [isLoaded, tasks]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), text, done: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    if (!confirm("Удалить задачу?")) return;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.done));
  };

  const beginEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEditing = () => {
    if (!editingId) return;
    const text = editText.trim();
    if (text) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => task.id === editingId ? { ...task, text } : task),
      );
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ru");
  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.done) ||
      (filter === "completed" && task.done);
    const matchesSearch = task.text.toLocaleLowerCase("ru").includes(normalizedQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="page-shell">
      <section className="task-panel" aria-labelledby="tasks-heading">
        <div className="panel-heading">
          <h1 id="tasks-heading">Список задач</h1>
          <span className="task-count">
            Выполнено {tasks.filter((task) => task.done).length} из {tasks.length}
          </span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="visually-hidden" htmlFor="new-task">Новая задача</label>
          <input
            id="new-task"
            name="task"
            placeholder="Новая задача"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <button className="add-button" type="submit">Добавить</button>
        </form>

        <div className="search-box" role="search">
          <label className="visually-hidden" htmlFor="task-search">Поиск задач</label>
          <input
            ref={searchInputRef}
            id="task-search"
            type="search"
            placeholder="Поиск задач"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button
            className="clear-search"
            type="button"
            aria-label="Очистить поиск"
            title="Очистить поиск"
            disabled={!searchQuery}
            onClick={() => setSearchQuery("")}
          >
            ×
          </button>
        </div>

        <div className="list-toolbar">
          <div className="filter-list" aria-label="Фильтр задач">
            {filters.map((item) => (
              <button
                className={"filter-button" + (filter === item.value ? " is-active" : "")}
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {tasks.some((task) => task.done) && (
            <button className="filter-button" type="button" onClick={clearCompleted}>
              Убрать готовые
            </button>
          )}
        </div>

        {tasks.length === 0 && !normalizedQuery ? (
          <div className="empty-result" role="status">Нет задач.</div>
        ) : visibleTasks.length === 0 && normalizedQuery ? (
          <div className="empty-result" role="status">По запросу „{searchQuery.trim()}“ ничего не найдено</div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-result" role="status">В этом фильтре пока нет задач.</div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className="task-row" key={task.id}>
                <button
                  className={"check-button" + (task.done ? " is-checked" : "")}
                  type="button"
                  aria-label={task.done ? "Вернуть задачу: " + task.text : "Выполнить задачу: " + task.text}
                  aria-pressed={task.done}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done ? "✓" : ""}
                </button>
                {editingId === task.id ? (
                  <input
                    className="edit-input"
                    autoFocus
                    value={editText}
                    aria-label={"Новый текст задачи: " + task.text}
                    onChange={(event) => setEditText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        saveEditing();
                      }
                      if (event.key === "Escape") cancelEditing();
                    }}
                  />
                ) : (
                  <button
                    className={"task-text task-text-button" + (task.done ? " is-done" : "")}
                    type="button"
                    title="Двойной щелчок для редактирования"
                    onDoubleClick={() => beginEditing(task)}
                  >
                    {task.text}
                  </button>
                )}
                <button
                  className="delete-button"
                  type="button"
                  aria-label={"Удалить задачу: " + task.text}
                  onClick={() => deleteTask(task.id)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
