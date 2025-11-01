
export function getLocalDateTime(value) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : new Date(value);
  // getTimezoneOffset is minutes to add to local time to get UTC, so subtracting it converts UTC->local
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
}

// Convert a value from <input type="datetime-local"> (local) back to a UTC ISO string for storage
export function localInputToUTC(localInputValue) {
  if (!localInputValue) return "";
  // new Date("yyyy-mm-ddThh:mm") creates a Date in local timezone; toISOString() converts to UTC
  return new Date(localInputValue).toISOString();
}
