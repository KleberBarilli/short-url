export abstract class UrlEntity_props {
  id?: string;
  originalUrl: string;
  code: string;
  clicks: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  lastClickedAt?: Date | null;
}

export class UrlEntity {
  constructor(private _props: UrlEntity_props) {}

  get props(): UrlEntity_props {
    return this._props;
  }

  incrementClicks() {
    this._props.clicks++;
    this._props.lastClickedAt = new Date();
  }

  decrementClicks() {
    if (this._props.clicks > 0) {
      this._props.clicks--;
    }
  }

  getShortUrl(): string {
    return `${this._props.originalUrl.replace(/\/$/, '')}/${this._props.code}`;
  }
}
