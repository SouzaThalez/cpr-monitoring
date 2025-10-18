import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { posPcrData } from '../../../data/posPcrData';
import { Intervention } from '../../models/intervention';
import { SaveDialog } from './save-dialog/save-dialog';

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

  captureTime(item: any) {
    // Impede registrar novamente o mesmo item
    const alreadyRegistered = this.lapTimes.some(l => l.name === item.name);
    if (alreadyRegistered) {
      this.snackBar.open('Você já registrou esta intervenção.', 'Fechar', {
        duration: 2500,
        panelClass: ['warn-snackbar']
      });
      return;
    }

    item.cliked = (item.cliked || 0) + 1;

    const itemValue: Intervention = {
      timer: this.formatTime(),
      name: item.name,
      label: item.label || 'Intervenção'
    };

    this.lapTimes.push(itemValue);
    this.saveToLocalStorage();
  }

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  removeLapItem(index: number, item: any) {
    this.lapTimes.splice(index, 1);
    const found = this.interventions.find(d => d.name === item.name);
    if (found && found.cliked > 0) {
      found.cliked--;
    }
    this.saveToLocalStorage();
  }

  openSaveDialog() {
    const dialogRef = this.matDialog.open(SaveDialog, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitReport();
      } else {
        // opcional: ações ao cancelar
      }
    });
  }

  /** Salva relatório no localStorage (ReportInterventionList) */
  private saveToLocalStorage() {
    localStorage.setItem('ReportInterventionList', JSON.stringify(this.lapTimes));
  }

  submitReport() {
    const report = {
      timestamp: new Date().toISOString(),
      entries: this.lapTimes,
    };

    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    existingReports.push(report);
    localStorage.setItem('reports', JSON.stringify(existingReports));
    this.exportCsvReport();

    // redireciona para próxima rota
    this.router.navigateByUrl('/private/pcr-review');
  }

  /** Gera e baixa um CSV do log atual (lapTimes) */
  exportCsvReport() {
    if (!this.lapTimes.length) {
      this.snackBar.open('Não há intervenções para exportar.', 'Fechar', { duration: 2500 });
      return;
    }

    const headers = ['#', 'Timer', 'Rótulo', 'Intervenção'];
    const rows = this.lapTimes.map((x, i) => [
      String(i + 1),
      x.timer ?? '',
      x.label ?? '',
      x.name ?? ''
    ]);

    const csv = this.buildCsv([headers, ...rows]);
    const filename = `post_cpr_log_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8');
  }

  /** Constrói CSV com escape seguro e BOM para Excel */
  private buildCsv(table: (string | number | null | undefined)[][]): string {
    const escape = (val: any) => {
      const s = (val ?? '').toString();
      // se contiver vírgula, aspas ou quebra de linha, encapsula e escapa aspas
      if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const body = table.map(row => row.map(escape).join(',')).join('\r\n');

    // BOM para abrir corretamente no Excel em PT-BR
    const BOM = '\uFEFF';
    return BOM + body;
  }

  private downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  restartApp() {
    this.lapTimes = [];
    this.interventions.forEach(i => (i.cliked = 0));
    localStorage.removeItem('ReportInterventionList');
  }
}
