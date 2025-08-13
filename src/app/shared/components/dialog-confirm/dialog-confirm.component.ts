import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirm } from '../../interfaces/dialog-confirm.interface';

/**
 * Component for a confirmation dialog.
 */
@Component({
  selector: 'app-dialog-confirm',
  imports: [MatButtonModule],
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {
  // Reference to the dialog opened by MatDialog.
  dialogRef = inject<MatDialogRef<DialogConfirmComponent>>(MatDialogRef);
  // Data passed to the dialog.
  data = inject<DialogConfirm>(MAT_DIALOG_DATA);

  /**
   * Closes the dialog without confirming.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Closes the dialog with confirmation.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
