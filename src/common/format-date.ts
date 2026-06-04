export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    year: "numeric",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  return formattedDate.format(date);
}