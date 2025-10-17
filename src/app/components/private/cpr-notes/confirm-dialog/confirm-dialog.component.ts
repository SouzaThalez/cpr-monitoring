import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
   standalone: false,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})


export class ConfirmDialogComponent implements OnInit{

  saveReport = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
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
