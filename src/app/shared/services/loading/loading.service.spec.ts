import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  const service: LoadingService = new LoadingService();

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
