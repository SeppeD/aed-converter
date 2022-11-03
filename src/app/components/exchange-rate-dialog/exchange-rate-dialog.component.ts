import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exchange-rate-dialog',
  template: `
      <h2 mat-dialog-title>Update Exchange Rate</h2>

      <mat-dialog-content class="mat-typography">
          <mat-form-field appearance="outline" color="accent">
              <mat-label>Exchange Rate</mat-label>
              <input matInput [(ngModel)]="data.exchangeRate" cdkFocusInitial type="number">
          </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
          <button mat-button (click)="dialogRef.close()">Cancel</button>
          <button mat-button (click)="closeDialog(data.exchangeRate)">Update</button>
      </mat-dialog-actions>
  `,
  styleUrls: [ './exchange-rate-dialog.component.scss' ]
})
export class ExchangeRateDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ExchangeRateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exchangeRate: number }
  ) {}

  ngOnInit(): void {
  }

  closeDialog(exchangeRate?: number): void {
    if (!exchangeRate || isNaN(+exchangeRate) || +exchangeRate === 0) {
      this.snackBar.open('Number is invalid', undefined, {
        duration: 2500,
        horizontalPosition: 'center',
        panelClass: [ 'snackbar-error' ]
      });
      return;
    }
    this.dialogRef.close(+exchangeRate);
  }
}
