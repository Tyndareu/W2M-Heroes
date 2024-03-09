import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingService } from './shared/services/loading/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const loadingService = jasmine.createSpyObj('LoadingService', [
    'setIsLoading',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: LoadingService, useValue: loadingService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'W2M' title`, () => {
    expect(component.title).toEqual('W2M');
  });
  it('should initialize isLoading to false', () => {
    expect(component.isLoading()).toBeFalse();
  });
  it('should subscribe to isLoadingSubject on setIsLoading', () => {
    const subjectSpy = new BehaviorSubject<boolean>(false);
    loadingService.isLoadingSubject = subjectSpy.asObservable();
    component.ngOnInit();
    expect(component.isLoading()).toBeFalse();
    subjectSpy.next(true);
    expect(component.isLoading()).toBeTrue();
  });
});
