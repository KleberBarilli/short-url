import { Test, TestingModule } from '@nestjs/testing';
import { CreateShortCodeService } from './create-short-code.service';
import { FindUrlByCodeService } from './find-url-by-code.service';

const findUrlByCodeServiceMock = {
  execute: jest.fn(),
};

describe('CreateShortCodeService', () => {
  let createShortCodeService: CreateShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortCodeService,
        { provide: FindUrlByCodeService, useValue: findUrlByCodeServiceMock },
      ],
    }).compile();

    createShortCodeService = module.get<CreateShortCodeService>(
      CreateShortCodeService,
    );
    findUrlByCodeServiceMock.execute.mockReset();
  });

  it('should generate a unique code on first try', async () => {
    findUrlByCodeServiceMock.execute.mockResolvedValueOnce(null);
    const code = await createShortCodeService.execute(6);
    expect(code).toHaveLength(6);
    expect(findUrlByCodeServiceMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should retry if code already exists and succeed', async () => {
    findUrlByCodeServiceMock.execute
      .mockResolvedValueOnce({ id: 'exists' })
      .mockResolvedValueOnce(null);
    const code = await createShortCodeService.execute(6);
    expect(code).toHaveLength(6);
    expect(findUrlByCodeServiceMock.execute).toHaveBeenCalledTimes(2);
  });

  it('should return null if max attempts reached', async () => {
    findUrlByCodeServiceMock.execute.mockResolvedValue({ id: 'exists' });
    const code = await createShortCodeService.execute(6);
    expect(code).toBeNull();
  });
});
