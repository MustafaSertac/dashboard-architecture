export const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

export const percent = (ratio: number) => `${Math.round(ratio * 100)}%`;

export const shortDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString();
