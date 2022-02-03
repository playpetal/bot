export function strong(text: string | number) {
  if (typeof text === "number") text = text.toLocaleString();
  return `**${text}**`;
}
