import { PartialUser, WordsData } from "petal";
import { Embed } from "../../../struct/embed";
import { displayName } from "../../util/displayName";
import { emoji as emojis } from "../../util/formatting/emoji";

export function getWordsEmbed(
  data: WordsData,
  user: PartialUser,
  rewards: number
): Embed {
  const embed = new Embed();
  let prefix: string;
  let suffix: string | undefined;

  const correct = data.guesses.find((g) => g === data.answer.toLowerCase());

  if (data.guesses.length === 0) {
    prefix = `${emojis.bloom} **welcome to petle!**\n**petle** is a k-pop version of the word game [Wordle](https://www.nytimes.com/games/wordle/index.html).\nyou can guess a word by using **\`/petle guess\`**! good luck!\n\n`;
  } else if (data.guesses.length === 6) {
    prefix = `${emojis.bloom} **petle X/6**\n\n`;
  } else {
    prefix = `${emojis.bloom} **petle ${data.guesses.length}/6**\n\n`;
  }

  if (correct) {
    suffix = `\n\n${emojis.bloom} **you got it in ${data.guesses.length} guess${
      data.guesses.length !== 1 ? "es" : ""
    } (${(data.elapsed! / 1000).toFixed(2)}s)!**`;

    if (rewards < 1) {
      suffix += `\nyou can't claim any more rewards this hour.`;
    } else {
      suffix += `\nchoose your reward from the options below!`;
    }
  } else if (data.guesses.length === 6) {
    suffix = `\n\n**better luck next time!**\nthe word was **\`${data.answer}\`**!`;
  }

  const words = generateWords(data);

  embed.setDescription(
    `${prefix}__${displayName(user)}__\n${words}${suffix || ""}`
  );

  return embed;
}

export function generateWords(data: WordsData): string {
  const answer = data.answer.toLowerCase();

  let rows = [
    emoji.EMPTY.repeat(5),
    emoji.EMPTY.repeat(5),
    emoji.EMPTY.repeat(5),
    emoji.EMPTY.repeat(5),
    emoji.EMPTY.repeat(5),
    emoji.EMPTY.repeat(5),
  ];

  for (let [index, guess] of data.guesses.entries()) {
    const emojis = generateWordEmojis(guess, answer);
    rows[index] = emojis;

    if (guess === answer) {
      rows = rows.slice(0, index + 1);
      break;
    }
  }

  return rows.join("\n");
}

function generateWordEmojis(_guess: string, _answer: string): string {
  const guess = _guess.toLowerCase();
  const answer = _answer.toLowerCase();

  let str = "";

  const matches: { letter: string; position: number }[] = [];
  const incorrectPositions: { letter: string; position: number }[] = [];

  for (let [index, letter] of [...guess].entries()) {
    if (answer[index] === letter) {
      matches.push({ letter, position: index });
    }
  }

  for (let [index, letter] of [...guess].entries()) {
    if (answer[index] === letter) {
      str += emoji.CORRECT[letter as keyof typeof emoji.CORRECT];
    } else if (answer.includes(letter)) {
      const expr = new RegExp(letter, "gi");
      const count = answer.match(expr)!.length;

      const matched = [...matches, ...incorrectPositions].filter(
        (m) => m.letter === letter
      );

      if (matched.length >= count) {
        str += emoji.INCORRECT[letter as keyof typeof emoji.INCORRECT];
      } else {
        incorrectPositions.push({ letter, position: index });
        str += emoji.INCORRECT_POS[letter as keyof typeof emoji.INCORRECT_POS];
      }
    } else {
      str += emoji.INCORRECT[letter as keyof typeof emoji.INCORRECT];
    }
  }

  return str;
}

const emoji = {
  EMPTY: "<:empty:947071036661321751>",
  CORRECT: {
    a: "<:a1:946994235008245781>",
    b: "<:b1:946994235100512286>",
    c: "<:c1:946994236065202176>",
    d: "<:d1:946994235440263261>",
    e: "<:e1:946994235943571506>",
    f: "<:f1:946994235276677120>",
    g: "<:g1:946994235876470794>",
    h: "<:h1:946994235457028167>",
    i: "<:i1:946994235574464562>",
    j: "<:j1:946994235847102464>",
    k: "<:k1:946994235947749376>",
    l: "<:l1:946994235889037353>",
    m: "<:m1:946994235972919307>",
    n: "<:n1:946994235914207232>",
    o: "<:o1:946994236006494238>",
    p: "<:p1:946994236107149312>",
    q: "<:q1:946995360692314122>",
    r: "<:r1:946995360541331516>",
    s: "<:s1:946995360423870515>",
    t: "<:t1:946995360004460586>",
    u: "<:u1:946995360180604959>",
    v: "<:v1:946995360662974464>",
    w: "<:w1:946995360960757820>",
    x: "<:x1:947049723771097108>",
    y: "<:y1:946995360914636842>",
    z: "<:z1:946995360822353971>",
  },
  INCORRECT: {
    a: "<:a1:946994234920144916>",
    b: "<:b1:946994234932731935>",
    c: "<:c1:946994235817734225>",
    d: "<:d1:946994235100516432>",
    e: "<:e1:946994236019060816>",
    f: "<:f1:946994235863891998>",
    g: "<:g1:946994235863887872>",
    h: "<:h1:946994235935166504>",
    i: "<:i1:946994235897434132>",
    j: "<:j1:946994235704483841>",
    k: "<:k1:946994236107141140>",
    l: "<:l1:946994235532542052>",
    m: "<:m1:946994235792556114>",
    n: "<:n1:946994236061007993>",
    o: "<:o1:946994236002283570>",
    p: "<:p1:946994235964526612>",
    q: "<:q1:946995359786364928>",
    r: "<:r1:946995360486793226>",
    s: "<:s1:946995360516177920>",
    t: "<:t1:946995360616808508>",
    u: "<:u1:946995360621031454>",
    v: "<:v1:946995360885260308>",
    w: "<:w1:946995360889471017>",
    x: "<:x1:947049723355873291>",
    y: "<:y1:946995360830726195>",
    z: "<:z1:946995360885243944>",
  },
  INCORRECT_POS: {
    a: "<:a1:946994235159236608>",
    b: "<:b1:946994235431862313>",
    c: "<:c1:946994235855499304>",
    d: "<:d1:946994235163430922>",
    e: "<:e1:946994235884843029>",
    f: "<:f1:946994235817738261>",
    g: "<:g1:946994235872264262>",
    h: "<:h1:946994235150848021>",
    i: "<:i1:946994235410886666>",
    j: "<:j1:946994235868078080>",
    k: "<:k1:946994235570286623>",
    l: "<:l1:946994235889053766>",
    m: "<:m1:946994235922612234>",
    n: "<:n1:946994235922612314>",
    o: "<:o1:946994235930984530>",
    p: "<:p1:946994235993894932>",
    q: "<:q1:946995360935608330>",
    r: "<:r1:946995360637784074>",
    s: "<:s1:946995360692318228>",
    t: "<:t1:946995360595853352>",
    u: "<:u1:946995360495202315>",
    v: "<:v1:946995360650387516>",
    w: "<:w1:946995360990109746>",
    x: "<:x1:947049723712376882>",
    y: "<:y1:946995360939773972>",
    z: "<:z1:946995360570675221>",
  },
} as const;
