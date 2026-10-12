export const getInitials = (name = "") =>
  name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export const formatDate = (dateKey, options = { weekday: "long", month: "long", day: "numeric" }) => {
  if (!dateKey) return "Not scheduled";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", options).format(new Date(year, month - 1, day, 12));
};

export const formatCompactDate = (dateKey) => formatDate(dateKey, { month: "short", day: "numeric" });

export const formatTime = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(2020, 0, 1, hour, minute);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
};

export const makeId = (prefix) => {
  const value = globalThis.crypto?.randomUUID?.() || String(Date.now()) + "-" + Math.random().toString(16).slice(2);
  return prefix + "-" + value;
};

export const sortByTime = (items) => [...items].sort((first, second) => first.time.localeCompare(second.time));

export const statusLabel = (status) => ({
  "checked-in": "Checked in",
  "in-room": "In room",
  arrived: "Arrived",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
}[status] || status);
