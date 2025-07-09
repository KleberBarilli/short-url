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

  getShortUrl(): string {
    return `${DEFAULT_API_URL.replace(/\/$/, '')}/${this._props.code}`;
  }
}
