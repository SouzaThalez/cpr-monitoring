import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-dialog',
  standalone: false,
  templateUrl: './save-dialog.html',
  styleUrl: './save-dialog.scss'
})
export class SaveDialog {

   saveAction = false;

  constructor(
    public dialogRef: MatDialogRef<SaveDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  
  ngOnInit(): void {

  } 

  onClose(value: boolean): void {

    if(value){
      this.saveAction = true;
    }
    
    this.dialogRef.close(this.saveAction);
  }

}
