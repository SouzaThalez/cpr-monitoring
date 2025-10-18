import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { posPcrData } from '../../../data/posPcrData';
import { SaveDialog } from './save-dialog/save-dialog';
// modelo do relatório salvo na key 'reports'
import { ReportModel } from '../../models/report';
import { Intervention } from '../../models/intervention';
import { InterventionReportModel } from '../../models/interventionReport';

@Component({
  selector: 'app-post-cpr',
  templateUrl: './post-cpr.html',
  styleUrls: ['./post-cpr.scss'],
  standalone: false
})
export class PostCpr {

  // botões de ações rápidas
  interventions = posPcrData.firstIntervention;

  // log atual em memória antes de persistir
  lapTimes: Intervention[] = [];

  // cronômetro básico (se quiser alimentar totalTimer depois)
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
    this.restartApp()
  }


  /** Clicar em um card registra a intervenção uma única vez */
  captureTime(item: any) {
    // impede registro duplicado
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
      type: 'tipo da intervencao'
    };

    this.lapTimes.push(entry);
  }

  /** Remove item do log atual e atualiza storage */
  removeLapItem(index: number, item: Intervention) {
    this.lapTimes.splice(index, 1);
    const found = this.interventions.find(d => d.name === item.name);
    if (found && found.cliked > 0) {
      found.cliked--;
    }

    // this.saveToLocalStorage();
  }

  /** Dialog antes de salvar em reports[] */
  openSaveDialog() {
    const dialogRef = this.matDialog.open(SaveDialog, { disableClose: true });
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
        this.submitReport(model);
      }
    });
  }

  /** Salva o log atual em localStorage.interventionReports */
  private saveToLocalStorage(model: InterventionReportModel) {
    const existingReports = JSON.parse(localStorage.getItem('interventionReports') || '[]');
    existingReports.push(model);
    localStorage.setItem('interventionReports', JSON.stringify(existingReports));
  }

  submitReport(model: any) {

    // 1) lê o que foi acumulado em interventionReports
    const raw = localStorage.getItem('interventionReports');
    const reportList: Intervention[] = raw ? JSON.parse(raw) : [];

    if (!reportList.length) {
      this.snackBar.open('Não há intervenções para salvar.', 'Fechar', { duration: 2500 });
      return;
    }

    // (opcional) exportação CSV do log atual
    this.exportCsvReport(reportList);

    // 4) redireciona para a tela de review
    this.router.navigateByUrl('/private/pcr-review');
  }

  /** Exporta o CSV do log atual (opcional) */
  private exportCsvReport(list: Intervention[]) {
    const headers = ['#', 'Timer', 'Rótulo', 'Intervenção'];
    const rows = list.map((x, i) => [
      String(i + 1),
      x.timer ?? '',
      x.label ?? '',
      x.name ?? ''
    ]);

    const csv = this.buildCsv([headers, ...rows]);
    const filename = `post_cpr_log_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8');
  }

  /** CSV helper */
  private buildCsv(table: (string | number | null | undefined)[][]): string {
    const escape = (val: any) => {
      const s = (val ?? '').toString();
      if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const body = table.map(row => row.map(escape).join(',')).join('\r\n');
    const BOM = '\uFEFF'; // Excel-friendly
    return BOM + body;
  }

  private downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  /** Limpa tudo deste componente */
  restartApp() {
    this.lapTimes = [];
    this.interventions.forEach(i => (i.cliked = 0));
  }
}
