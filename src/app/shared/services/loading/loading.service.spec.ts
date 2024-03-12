import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial isLoadingSubject value of false', () => {
    expect(service.isLoadingSubject$.getValue()).toBeFalse();
  });

  it('should show loader when showLoader is called', () => {
    service.showLoader();
    expect(service.isLoadingSubject$.getValue()).toBeTrue();
  });

  it('should hide loader when hideLoader is called', () => {
    service.hideLoader();
    expect(service.isLoadingSubject$.getValue()).toBeFalse();
  });
});
