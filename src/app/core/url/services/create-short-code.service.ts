import { Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { FindUrlByCodeService } from './find-url-by-code.service';
import { CREATE_SHORT_CODE_MAX_RETRIES } from 'src/app/common/constants';

@Injectable()
export class CreateShortCodeService {
  constructor(private findUrlByCodeService: FindUrlByCodeService) {}

  async execute(length: number): Promise<string | null> {
    const MAX_ATTEMPTS = CREATE_SHORT_CODE_MAX_RETRIES;
    let attempt = 0;
    let code: string;
    let existingUrlId: { id: string } | null;

    do {
      code = this.generateCode(length);
      existingUrlId = await this.findUrlByCodeService.execute(code);
      attempt++;
    } while (existingUrlId && attempt < MAX_ATTEMPTS);

    if (existingUrlId) {
      Logger.warn(
        `Failed to generate a unique code after ${MAX_ATTEMPTS} attempts.`,
      );
      return null;
    }

    return code;
  }

  private generateCode(length: number): string {
    return nanoid(length);
  }
}
