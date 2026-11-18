const filters = ["Все", "Активные", "Выполненные"];

export default function Home() {
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
          <span className="task-count">0 задач</span>
        </div>

        <form className="task-form">
          <label className="visually-hidden" htmlFor="new-task">Новая задача</label>
          <input id="new-task" name="task" placeholder="Что нужно сделать?" />
          <button className="add-button" type="button"><span aria-hidden="true">+</span> Добавить</button>
        </form>

        <div className="list-toolbar">
          <div className="filter-list" aria-label="Фильтр задач">
            {filters.map((filter, index) => (
              <button className={`filter-button${index === 0 ? " is-active" : ""}`} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
        </div>

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

        <footer className="panel-footer">
          <span className="privacy-dot" aria-hidden="true" />
          Твои задачи сохраняются только на этом устройстве
        </footer>
      </section>

      <footer className="page-footer">Один шаг за раз <span aria-hidden="true">·</span> Всё получится</footer>
    </main>
  );
}
