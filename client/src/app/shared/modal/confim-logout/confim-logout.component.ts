import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Вы уверены?</h1>
    <div mat-dialog-content>Вы точно хотите выйти из личного кабинета?</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onConfirm()">Выйти</button>
      <button mat-button style="margin-top:10px ;" (click)="onCancel()">
        Отмена
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
