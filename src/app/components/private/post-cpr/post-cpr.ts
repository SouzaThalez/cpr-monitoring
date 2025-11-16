import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { posPcrData } from '../../../data/posPcrData';
import { SaveDialog } from './save-dialog/save-dialog';

import { Intervention } from '../../../models/intervention';
import { InterventionReportModel } from '../../../models/interventionReport';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-post-cpr',
  templateUrl: './post-cpr.html',
  styleUrls: ['./post-cpr.scss'],
  standalone: false
})
export class PostCpr {

  interventions = posPcrData.firstIntervention;
  lapTimes: Intervention[] = [];

  time: number = 0;
  milliseconds: number = 0;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    moment.locale('pt-br');
  }

  ngOnInit(): void {
    this.restartApp();
  }

  /** Clicar em um card registra a intervenção uma única vez */
  captureTime(item: any) {
    const already = this.lapTimes.some(l => l.name === item.name);
    if (already) {
      this.snackBar.open('Você já registrou esta intervenção.', 'Fechar', {
        duration: 2500,
        panelClass: ['warn-snackbar']
      });
      return;
    }

    item.cliked = (item.cliked || 0) + 1;

    const entry: Intervention = {
      timer: this.formatTime(),
      name: item.name,
      label: item.label || 'Intervenção',
    } as Intervention;

    this.lapTimes.push(entry);
  }

  removeLapItem(index: number, item: Intervention) {
    this.lapTimes.splice(index, 1);
    const found = this.interventions.find(d => d.name === item.name);
    if (found && found.cliked > 0) {
      found.cliked--;
    }
  }

  openSaveDialog() {

    const dialogRef = this.matDialog.open(SaveDialog,
      {
        disableClose: true
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const model: InterventionReportModel = {
          timestamp: new Date().toISOString(),
          interventionList: this.lapTimes,
          interventionDate: moment().format('DD-MM-YYYY'),
          totalTimer: this.formatTime(),
          user: 'padrão'
        };

        this.saveToLocalStorage(model);
        this.submitReport();
      }
    });
  }

  restartApp() {
    this.lapTimes = [];
    this.interventions.forEach(i => (i.cliked = 0));
  }

  private saveToLocalStorage(model: InterventionReportModel) {

    const existing: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');
    existing.push(model);
    localStorage.setItem('interventionReports', JSON.stringify(existing));
  }

  private submitReport() {

    const stored: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');
    if (!stored.length) {
      this.snackBar.open('Não há intervenções para salvar.', 'Fechar', { duration: 2500 });
      return;
    }

  
  //  this.generatePDF(stored);

    this.router.navigateByUrl('/private/pcr-review');
  }


  private formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  private padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  


}
