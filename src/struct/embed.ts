export class Embed {
  title?: string;
  type?: string = "rich";
  description?: string;
  url?: string;
  timestamp?: string | Date;
  color?: number = parseInt("FFAACC", 16);
  thumbnail?: {
    url: string;
    proxy_url?: string;
  };
  image?: {
    url: string;
    proxy_url?: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  fields: { name: string; value: string; inline?: boolean }[] = [];

  public setAuthor(name: string, iconUrl?: string, url?: string) {
    this.author = { name, icon_url: iconUrl, url };
    return this;
  }

  public setTitle(str: string) {
    this.title = str;
    return this;
  }

  public setDescription(str: string) {
    this.description = str;
    return this;
  }

  public setUrl(str: string) {
    this.url = str;
    return this;
  }

  public setTimestamp(time: string | Date) {
    this.timestamp = time;
    return this;
  }

  public setColor(color: number | string) {
    if (typeof color === "string") {
      this.color = parseInt(color.startsWith("#") ? color.slice(1) : color, 16);
    } else this.color = color;
    return this;
  }

  public setThumbnail(url: string) {
    this.thumbnail = { url };
    return this;
  }

  public setImage(url: string) {
    this.image = { url };
    return this;
  }

  public setFooter(str: string, icon?: string) {
    this.footer = { text: str, icon_url: icon };
    return this;
  }

  public addField({ name, value, inline }: Field) {
    this.fields.push({ name, value, inline });
    return this;
  }

  public addFields(fields: Field[]) {
    this.fields.push(...fields);
    return;
  }
}

export class ErrorEmbed {
  color?: number = parseInt("F04747", 16);
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}

type Field = { name: string; value: string; inline?: boolean };
