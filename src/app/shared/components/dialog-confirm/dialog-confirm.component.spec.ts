import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirm } from '../../interfaces/dialog-confirm.interface';
import { DialogConfirmComponent } from './dialog-confirm.component';

describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent;
  let fixture: ComponentFixture<DialogConfirmComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogConfirmComponent>>;
  const dialogData: DialogConfirm = {
    title: 'Confirm Action',
    text: 'Are you sure you want to proceed?',
    name: 'hero',
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [MatButtonModule], // Import MatButtonModule
      providers: [
        DialogConfirmComponent, // Remove the declaration here
        { provide: MatDialogRef, useValue: spy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<DialogConfirmComponent>
    >;
    fixture = TestBed.createComponent(DialogConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title and message correctly from MAT_DIALOG_DATA', () => {
    expect(component.data).toEqual(dialogData);
  });

  it('should close dialog with false value onNoClick', () => {
    component.onNoClick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true value onConfirm', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
