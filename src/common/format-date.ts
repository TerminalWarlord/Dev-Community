export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka"
  });
  return formattedDate.format(date);
}