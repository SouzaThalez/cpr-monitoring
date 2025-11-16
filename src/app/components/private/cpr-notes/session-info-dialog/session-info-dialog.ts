import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-info-dialog',
  standalone: false,
  templateUrl: './session-info-dialog.html',
  styleUrl: './session-info-dialog.scss'
})
export class SessionInfoDialog implements OnInit{

  
form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SessionInfoDialog>
  ) {
    this.form = this.fb.group({
      avaliador: ['', Validators.required],
      aluno: ['', Validators.required],
      grupo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
   
  }

  
  onClose(save: boolean) {
    if (save && this.form.valid) {
      this.dialogRef.close(this.form.value); // Retorna os dados preenchidos
    } else {
      this.dialogRef.close(null); // Fecha sem salvar
    }
  }






}
