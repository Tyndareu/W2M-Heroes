/**
 * Interface for data passed to the confirmation dialog.
 */
export interface DialogConfirm {
  /**
   * The title of the dialog.
   */
  title: string;
  /**
   * The main text content of the dialog.
   */
  text: string;
  /**
   * The name of the item being confirmed (e.g., hero name for deletion).
   */
  name: string;
}
