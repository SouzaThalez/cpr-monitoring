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
        this.submitReport();
      }
    });
  }

  /** Persiste no array interventionReports */
  private saveToLocalStorage(model: InterventionReportModel) {
    const existing: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');
    existing.push(model);
    localStorage.setItem('interventionReports', JSON.stringify(existing));
  }

  /** Lê interventionReports e exporta CSV do registro mais recente (ou do conjunto) */
  submitReport() {
    const stored: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');

    if (!stored.length) {
      this.snackBar.open('Não há intervenções para salvar.', 'Fechar', { duration: 2500 });
      return;
    }

    // passa a lista como veio do storage; o exportCsvReport normaliza
    this.exportCsvReport(stored);

    this.router.navigateByUrl('/private/pcr-review');
  }

  /**
   * Aceita tanto:
   *  - Intervention[] (quando você passar só a lista)
   *  - InterventionReportModel[] (como vem do localStorage)
   * Normaliza para Intervention[] antes de montar o CSV.
   */
  private exportCsvReport(listOrModels: Intervention[] | InterventionReportModel[]) {
    const rowsSource = this.normalizeCsvSource(listOrModels);

    if (!rowsSource.length) {
      this.snackBar.open('Nenhum dado para exportar.', 'Fechar', { duration: 2500 });
      return;
    }

    const headers = ['#', 'Timer', 'Rótulo', 'Intervenção'];
    const rows = rowsSource.map((x, i) => [
      String(i + 1),
      x.timer ?? '',
      x.label ?? '',
      x.name ?? ''
    ]);

    const csv = this.buildCsv([headers, ...rows]);
    const filename = `post_cpr_log_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8');
  }

  /** Converte qualquer fonte para uma lista de Intervention */
  private normalizeCsvSource(input: Intervention[] | InterventionReportModel[]): Intervention[] {
    if (!Array.isArray(input) || input.length === 0) return [];

    // Caso seja diretamente Intervention[]
    const looksLikeIntervention =
      'timer' in (input[0] as any) && 'name' in (input[0] as any) && 'label' in (input[0] as any);
    if (looksLikeIntervention) {
      return input as Intervention[];
    }

    // Caso seja InterventionReportModel[]
    const models = input as InterventionReportModel[];
    // Exporta o último relatório salvo (mais recente)
    const last = models[models.length - 1];
    return Array.isArray(last?.interventionList) ? last!.interventionList! : [];
  }

  /** CSV helpers */
  private buildCsv(table: (string | number | null | undefined)[][]): string {
    const escape = (val: any) => {
      const s = (val ?? '').toString();
      if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const body = table.map(row => row.map(escape).join(',')).join('\r\n');
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

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  restartApp() {
    this.lapTimes = [];
    this.interventions.forEach(i => (i.cliked = 0));
  }
}
