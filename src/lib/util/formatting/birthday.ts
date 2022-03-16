export function trimBirthday(str?: string): string | undefined {
  if (!str) return str;
  return str
    .replace(/\(\d\d\d\d-\d\d-\d\d\)|\(No Birthday\)|\(No Date\)/gi, "")
    .trim();
}
