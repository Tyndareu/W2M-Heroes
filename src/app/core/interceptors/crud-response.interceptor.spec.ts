import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CRUDResponseInterceptor } from './crud-response.interceptor';

describe('CRUDResponseInterceptor', () => {
  let interceptor: CRUDResponseInterceptor;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        CRUDResponseInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CRUDResponseInterceptor,
          multi: true,
        },
        MatSnackBar,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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
  it('should show success snackbar for POST request', () => {
    const mockData = { id: 1, name: 'Test Data' };
    spyOn(snackBar, 'open').and.callThrough();

    http.post('/api/data', mockData).subscribe({
      next: response => {
        expect(response).toEqual(mockData);
        expect(snackBar.open).toHaveBeenCalledWith(
          'Data has been created successfully.',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: fail,
    });

    const req = httpTestingController.expectOne('/api/data');
    req.flush(mockData);
  });
  it('should show success snackbar for PUT request', () => {
    const mockData = { id: 1, name: 'Updated Data' };
    spyOn(snackBar, 'open').and.callThrough();

    http.put('/api/data/1', mockData).subscribe({
      next: response => {
        expect(response).toEqual(mockData);
        expect(snackBar.open).toHaveBeenCalledWith(
          'Data has been updated successfully.',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: fail,
    });

    const req = httpTestingController.expectOne('/api/data/1');
    req.flush(mockData);
  });
  it('should show success snackbar for DELETE request', () => {
    spyOn(snackBar, 'open').and.callThrough();

    http.delete('/api/data/1').subscribe({
      next: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'Data has been deleted successfully.',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: fail,
    });

    const req = httpTestingController.expectOne('/api/data/1');
    req.flush({});
  });

  it('should show error snackbar for failed GET request', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    spyOn(snackBar, 'open').and.callThrough();

    http.get('/api/data').subscribe({
      next: fail,
      error: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'An error occurred while retrieving data: 404 Not Found',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.error(new ProgressEvent('Error'), mockErrorResponse);
  });
  it('should show error snackbar for failed PUT request', () => {
    const mockData = { id: 1, name: 'Updated Data' };
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    spyOn(snackBar, 'open').and.callThrough();

    http.put('/api/data', mockData).subscribe({
      next: fail,
      error: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'An error occurred while updating data: 404 Not Found',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.error(new ProgressEvent('Error'), mockErrorResponse);
  });
  it('should show error snackbar for failed POST request', () => {
    const mockData = { id: 1, name: 'Updated Data' };
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    spyOn(snackBar, 'open').and.callThrough();

    http.post('/api/data', mockData).subscribe({
      next: fail,
      error: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'An error occurred while creating data: 404 Not Found',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.error(new ProgressEvent('Error'), mockErrorResponse);
  });

  it('should show error snackbar for failed DELETE request', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    spyOn(snackBar, 'open').and.callThrough();

    http.delete('/api/data').subscribe({
      next: fail,
      error: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'An error occurred while deleting data: 404 Not Found',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.error(new ProgressEvent('Error'), mockErrorResponse);
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

  it('should show success snackbar for PATCH request', () => {
    const mockData = { id: 1, name: 'Updated Data' };
    spyOn(snackBar, 'open').and.callThrough();

    http.patch('/api/data/1', mockData).subscribe({
      next: response => {
        expect(response).toEqual(mockData);
        expect(snackBar.open).toHaveBeenCalledWith(
          'The PATCH request has been successful.',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: fail,
    });

    const req = httpTestingController.expectOne('/api/data/1');
    req.flush(mockData);
  });
  it('should show error snackbar for PATCH request', () => {
    const mockErrorResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };
    spyOn(snackBar, 'open').and.callThrough();

    http.patch('/api/data/1', {}).subscribe({
      next: fail,
      error: () => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'An error occurred during the PATCH request: 500 Internal Server Error',
          'Close',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    const req = httpTestingController.expectOne('/api/data/1');
    req.error(new ProgressEvent('Error'), mockErrorResponse);
  });
});
