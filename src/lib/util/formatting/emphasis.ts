type EmphasisType = "b" | "i" | "u";
type Emphasis = `${EmphasisType}${EmphasisType | ""}${EmphasisType | ""}`;

export function emphasis(str: string | number, type: Emphasis = "b"): string {
  if (typeof str === "number") str = str.toLocaleString();

  let emphasized = str.replace(/\*/gi, "\\*");

  if (type.includes("b")) emphasized = `**${emphasized}**`;
  if (type.includes("i")) emphasized = `*${emphasized}*`;
  if (type.includes("u")) emphasized = `__${emphasized}__`;

  return emphasized;
}
