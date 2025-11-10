import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  standalone: false,
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss'
})
export class InfoDialog {

form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InfoDialog>
  ) {
    this.form = this.fb.group({
      avaliador: ['', Validators.required],
      aluno: ['', Validators.required],
      grupo: ['', Validators.required]
    });
  }

  onClose(save: boolean) {
    if (save && this.form.valid) {
      this.dialogRef.close(this.form.value); // Retorna os dados preenchidos
    } else {
      this.dialogRef.close(null); // Fecha sem salvar
    }
  }


}
