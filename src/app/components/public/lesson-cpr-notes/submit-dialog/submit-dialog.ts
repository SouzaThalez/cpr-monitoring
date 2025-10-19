import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-dialog',
  standalone: false,
  templateUrl: './submit-dialog.html',
  styleUrl: './submit-dialog.scss'
})
export class SubmitDialog {

    saveReport = false;

  constructor(
    public dialogRef: MatDialogRef<SubmitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  
  ngOnInit(): void {

  } 

  onClose(value: boolean): void {

    if(value){
      this.saveReport = true;
    }
    
    this.dialogRef.close(this.saveReport);
  }

}
