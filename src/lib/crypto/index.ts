import jwt from "jsonwebtoken";

export function tokenize(id: string): string {
  return jwt.sign({ id }, process.env.SHARED_SECRET!);
}
