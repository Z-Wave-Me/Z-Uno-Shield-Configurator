import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly matSnackBar: MatSnackBar,
    ) {}

  public show(message: string): void {
    this.matSnackBar.open(message, 'OK', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }
}
