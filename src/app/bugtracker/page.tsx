const bugs = [
  {
    id: 1,
    title: "Launcher crashes after clicking Play",
    status: "Open",
    severity: "High",
  },
  {
    id: 2,
    title: "Incorrect rank displayed in lobby",
    status: "In Progress",
    severity: "Medium",
  },
];

export default function BugTrackerPage() {
  return (
    <main>
      <h1>Bug Tracker</h1>

      <a href="/">Back home</a>

      <ul>
        {bugs.map((bug) => (
          <li key={bug.id}>
            <strong>{bug.title}</strong>
            <p>Status: {bug.status}</p>
            <p>Severity: {bug.severity}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}