import { DEFAULT_API_URL } from 'src/app/common/constants';

export abstract class UrlEntityProps {
  id?: string;
  userId: string | null;
  originalUrl: string;
  shortUrl?: string;
  code: string;
  clicks: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  lastClickedAt?: Date | null;
}

export class UrlEntity {
  constructor(private _props: UrlEntityProps) {}

  get props(): UrlEntityProps {
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
    return `${DEFAULT_API_URL.replace(/\/$/, '')}/${this._props.code}`;
  }
}
