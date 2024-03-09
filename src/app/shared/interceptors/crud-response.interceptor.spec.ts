import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpResponse,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CRUDResponseInterceptor } from './crud-response.interceptor';

describe('CRUDResponseInterceptor', () => {
  let interceptor: CRUDResponseInterceptor;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CRUDResponseInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CRUDResponseInterceptor,
          multi: true,
        },
        MatSnackBar,
      ],
    });
    interceptor = TestBed.inject(CRUDResponseInterceptor);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not show snackbar for successful GET request', () => {
    spyOn(snackBar, 'open');
    const httpResponse = new HttpResponse({ status: 200 });

    http.get('/api/test').subscribe(() => {
      expect(snackBar.open).not.toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(httpResponse);
  });
});
