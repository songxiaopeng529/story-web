const fullDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const compactDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return fullDateFormatter.format(new Date(`${value}T00:00:00.000Z`));
}

export function formatCompactDate(value: string) {
  return compactDateFormatter.format(new Date(`${value}T00:00:00.000Z`));
}
