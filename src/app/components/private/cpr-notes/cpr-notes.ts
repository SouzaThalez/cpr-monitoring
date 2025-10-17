import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import moment from 'moment';
import { drugsPcrData } from '../../../data/drugsPcrData';
import { pcrRithmsData } from '../../../data/pcrRithmsData';
import { Drug } from '../../models/drug';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cpr-notes',
  standalone: false,
  templateUrl: './cpr-notes.html',
  styleUrls: ['./cpr-notes.scss']
})
export class CprNotes {

  drugs = drugsPcrData;
  rithms = pcrRithmsData;
  activeRithm: string = '';
  lapTimes: Drug[] = [];

  running: boolean = false;
  time: number = 0;
  milliseconds: number = 0;
  private timer: any;
  initialTime: string = '';
  endTime: string = '';
  activeDrug: any = null;

  constructor(
    private matDialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void { }

  startStopwatch() {
    moment.locale('pt-br');
    this.initialTime = moment().format('LT');

    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        this.milliseconds++;
        if (this.milliseconds >= 100) {
          this.milliseconds = 0;
          this.time++;
        }
      }, 10);
    }
  }

  stopStopwatch() {
    moment.locale('pt-br');
    this.endTime = moment().format('LT');
    this.running = false;
    this.activeRithm = '';
    clearInterval(this.timer);
    this.openConfirmDialog();
  }

  restartApp() {
    this.resetStopwatch();
    this.lapTimes = [];
    this.activeRithm = '';
  }

  resetStopwatch() {
    clearInterval(this.timer);
    this.running = false;
    this.time = 0;
    this.milliseconds = 0;
  }

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  captureTime(drug: any) {
    
    drug.cliked = (drug.cliked || 0) + 1;
    const drugValue: Drug = {
      timer: this.formatTime(),
      name: drug.name,
      type: drug.type,
      label: drug.label
    };
    this.lapTimes.push(drugValue);
  }

  removeLapItem(index: number, drug: any) {
    this.lapTimes.splice(index, 1);
    if (this.drugs.rcpDrugs.find(d => d.name === drug.name)) {
      this.drugs.rcpDrugs.find(d => d.name === drug.name)!.cliked--;
    }
    if (this.drugs.interventions.find(d => d.name === drug.name)) {
      this.drugs.interventions.find(d => d.name === drug.name)!.cliked--;
    }
  }


  setActiveDrug(drug: any) {
    this.activeDrug = drug;
  }


  getRithm(value: any) {
    this.activeRithm = value.name;
    this.lapTimes.push({
      timer: this.formatTime(),
      name: this.activeRithm,
      type: 'rithm',
      label: 'Check'
    });
  }




  openConfirmDialog() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, { disableClose: true });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reportModel = {
          reportList: this.lapTimes,
          reportDate: moment().format('DD-MM-YYYY'),
          totalTimer: this.formatTime(),
          startTimer: this.initialTime,
          endTimer: this.endTime,
          user: 'padrão'
        };
        this.saveReportToLocalStorage(reportModel);
      } else {
        this.startStopwatch();
      }
    });
  }

 private saveReportToLocalStorage(model: any) {
  const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
  existingReports.push(model);
  localStorage.setItem('reports', JSON.stringify(existingReports));

  // redireciona para outra rota se desejar
  this.router.navigateByUrl('/private/cuidados-pos');
}

}
