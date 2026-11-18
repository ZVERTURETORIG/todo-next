"use client";

import { useEffect, useState, type FormEvent } from "react";

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
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Todo Next — главная">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span className="brand-name">todo<span>next</span></span>
        </a>
        <span className="header-note">Маленькие шаги тоже ведут вперёд</span>
      </header>

      <section className="intro" id="home">
        <p className="eyebrow">ТВОЙ ПРОСТОЙ ПЛАН</p>
        <h1>День становится легче,<br />когда есть <span>план.</span></h1>
        <p className="intro-copy">Запиши главное и двигайся в своём темпе.</p>
      </section>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">СПИСОК НА СЕГОДНЯ</p>
            <h2 id="tasks-heading">Мои задачи</h2>
          </div>
          <span className="task-count">Выполнено {tasks.filter((task) => task.done).length} / {tasks.length}</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="visually-hidden" htmlFor="new-task">Новая задача</label>
          <input
            id="new-task"
            name="task"
            placeholder="Например, купить продукты"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <button className="add-button" type="submit"><span aria-hidden="true">+</span> Добавить</button>
        </form>

        <div className="search-box" role="search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <label className="visually-hidden" htmlFor="task-search">Поиск задач</label>
          <input
            id="task-search"
            type="search"
            placeholder="Найти задачу"
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
                className={`filter-button${filter === item.value ? " is-active" : ""}`}
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {tasks.length === 0 && !normalizedQuery ? (
          <div className="empty-state">
            <div className="empty-art" aria-hidden="true">
              <span className="empty-sun" />
              <span className="empty-card empty-card-back" />
              <span className="empty-card empty-card-front"><i /><i /><i /></span>
              <span className="empty-spark">✳</span>
            </div>
            <h3>Начни с небольшой задачи</h3>
            <p>Добавь первое дело — дальше будет проще.</p>
          </div>
        ) : visibleTasks.length === 0 && normalizedQuery ? (
          <div className="empty-result" role="status">По запросу „{searchQuery.trim()}“ ничего не найдено</div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-result">В этом фильтре пока нет задач.</div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className="task-row" key={task.id}>
                <button
                  className={`check-button${task.done ? " is-checked" : ""}`}
                  type="button"
                  aria-label={task.done ? `Вернуть задачу: ${task.text}` : `Выполнить задачу: ${task.text}`}
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
                    aria-label={`Новый текст задачи: ${task.text}`}
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
                    className={`task-text task-text-button${task.done ? " is-done" : ""}`}
                    type="button"
                    title="Двойной щелчок для редактирования"
                    onDoubleClick={() => beginEditing(task)}
                  >
                    {task.text}
                  </button>
                )}
                <button className="delete-button" type="button" aria-label={`Удалить задачу: ${task.text}`} onClick={() => deleteTask(task.id)}>×</button>
              </li>
            ))}
          </ul>
        )}

        <footer className="panel-footer">
          <span className="privacy-dot" aria-hidden="true" />
          Твои задачи сохраняются только на этом устройстве
        </footer>
      </section>

      <footer className="page-footer">Один шаг за раз <span aria-hidden="true">·</span> Всё получится</footer>
    </main>
  );
}
