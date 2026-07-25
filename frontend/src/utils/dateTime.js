export const LOCAL_TIME_ZONE = "Asia/Colombo";

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatLocalDateTime = (value, fallback = "—") => {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat("en-LK", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: LOCAL_TIME_ZONE,
      }).format(date)
    : fallback;
};

export const formatLocalDate = (value, fallback = "—") => {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: LOCAL_TIME_ZONE,
      }).format(date)
    : fallback;
};

export const formatLocalTime = (value, fallback = "—") => {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat("en-LK", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: LOCAL_TIME_ZONE,
      }).format(date)
    : fallback;
};
