import songs from "./songs.json";

type Song = {
  title: string;
  artist: string;
  spotify: string | null;
  youtube: string | null;
  apple: string | null;
};

export function getSong() {
  return (songs as Song[])[Math.floor(Math.random() * songs.length)];
}
