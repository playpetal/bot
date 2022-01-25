declare module "petal" {
  export type PartialUser = {
    id: number;
    username: string;
    title: { title: { title: string } } | null;
  };
}
