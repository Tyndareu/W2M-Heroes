import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirm } from '../../interfaces/dialog-confirm.interface';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {
  dialogRef = inject<MatDialogRef<DialogConfirmComponent>>(MatDialogRef);
  data = inject<DialogConfirm>(MAT_DIALOG_DATA);


  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
