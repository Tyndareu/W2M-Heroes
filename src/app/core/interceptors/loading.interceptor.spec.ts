import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let loadingService: LoadingService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        LoadingInterceptor,
        LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    interceptor = TestBed.inject(LoadingInterceptor);
    loadingService = TestBed.inject(LoadingService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should show loader before making HTTP request', () => {
    spyOn(loadingService, 'showLoader');
    spyOn(loadingService, 'hideLoader').and.callThrough();
    const dummyData = { data: 'test' };

    http.get('/api/test').subscribe();

    const req = httpTestingController.expectOne('/api/test');
    expect(req.request.method).toEqual('GET');

    expect(loadingService.showLoader).toHaveBeenCalled();
    req.flush(dummyData);
    expect(loadingService.hideLoader).toHaveBeenCalled();
  });

  it('should not show loader for specific HTTP request', () => {
    spyOn(loadingService, 'showLoader');
    spyOn(loadingService, 'hideLoader').and.callThrough();
    const dummyData = { data: 'test' };

    http.get('/heroes?q=test').subscribe();

    const req = httpTestingController.expectOne('/heroes?q=test');
    expect(req.request.method).toEqual('GET');

    expect(loadingService.showLoader).not.toHaveBeenCalled();
    req.flush(dummyData);
    expect(loadingService.hideLoader).not.toHaveBeenCalled();
  });
});
