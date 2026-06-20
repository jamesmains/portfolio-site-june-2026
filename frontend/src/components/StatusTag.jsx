// frontend/src/components/StatusTag.jsx
export default function StatusTag({ status }) {
  const cls = status === "Complete" ? "complete"
    : status === "Archived" ? "archived"
    : status === "In Progress" ? "in-progress"
    : "";
  return <span className={`tag tag-status ${cls}`}>{status}</span>;
}