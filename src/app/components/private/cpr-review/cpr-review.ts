import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';

import { ReportCard } from '../../models/reportCard';
import { ReportModel } from '../../models/report';
import { InterventionReportModel } from '../../models/interventionReport';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cpr-review',
  standalone: false,
  templateUrl: './cpr-review.html',
  styleUrls: ['./cpr-review.scss']
})
export class CprReview implements OnInit {

  reports: ReportCard[] = [];
  selected?: ReportCard;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    moment.locale('pt-br');
    this.loadFromLocalStorage();
  }

  /** Carrega e normaliza dados de localStorage (reports + interventionReports) */
  private loadFromLocalStorage() {
    // 1) Registros gerados pelo cpr-notes
    const parsedReports: ReportModel[] =
      this.safeParse<ReportModel[]>(localStorage.getItem('reports')) || [];

    // 2) Registros gerados pelo post-cpr
    const interventionReports: InterventionReportModel[] =
      this.safeParse<InterventionReportModel[]>(localStorage.getItem('interventionReports')) || [];

    const cards: ReportCard[] = [];

    // Mapear interventionReports -> ReportCard (footer: cuidados pós-PCR)
    interventionReports.forEach((rep, idx) => {
      const entries = Array.isArray(rep.interventionList) ? rep.interventionList : [];
      const t = this.pickTimestampFromIntervention(rep) ?? new Date().toISOString();
      const when = moment(t).isValid() ? moment(t) : moment();

      const whenLabel = when.calendar(undefined, {
        sameDay: '[Hoje] HH:mm',
        lastDay: '[Ontem] HH:mm',
        nextDay: '[Amanhã] HH:mm',
        lastWeek: 'DD/MM/YYYY HH:mm',
        nextWeek: 'DD/MM/YYYY HH:mm',
        sameElse: 'DD/MM/YYYY HH:mm'
      });

      const subtitle = `${entries.length} intervenç${entries.length === 1 ? 'ão' : 'ões'}`;

      cards.push({
        id: `postcpr-${idx}-${when.valueOf()}`,
        whenLabel,
        subtitle,
        entries,
        footerLabel: 'relatório dos cuidados pos pcr',
        raw: rep
      });
    });

    // Mapear reports -> ReportCard (footer: RCP)
    parsedReports.forEach((rep, idx) => {
      const entries = Array.isArray(rep.reportList) ? rep.reportList : [];
      const t = this.pickTimestampFromReport(rep) ?? new Date().toISOString();
      const when = moment(t).isValid() ? moment(t) : moment();

      const whenLabel = when.calendar(undefined, {
        sameDay: '[Hoje] HH:mm',
        lastDay: '[Ontem] HH:mm',
        nextDay: '[Amanhã] HH:mm',
        lastWeek: 'DD/MM/YYYY HH:mm',
        nextWeek: 'DD/MM/YYYY HH:mm',
        sameElse: 'DD/MM/YYYY HH:mm'
      });

      const subtitle = `${entries.length} intervenç${entries.length === 1 ? 'ão' : 'ões'}`;

      cards.push({
        id: `rcp-${idx}-${when.valueOf()}`,
        whenLabel,
        subtitle,
        entries,
        footerLabel: 'relatório da rcp',
        raw: rep
      });
    });

    // (Opcional) Ordenar do mais recente para o mais antigo
    cards.sort((a, b) => {
      // tentar obter timestamp dos "raw"
      const ta = this.tryToMoment(a.raw).valueOf();
      const tb = this.tryToMoment(b.raw).valueOf();
      return tb - ta;
    });

    this.reports = cards;
    this.selected = this.reports[0]; // seleciona o primeiro por padrão (se existir)
  }

  /** Utilitário: parse seguro */
  private safeParse<T>(json: string | null): T | null {
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  /** Tenta extrair um momento válido de ReportModel */
  private pickTimestampFromReport(rep: ReportModel): string | undefined {
    if (rep.timestamp) return rep.timestamp;
    if (rep.reportDate) {
      const m = moment(rep.reportDate, 'DD-MM-YYYY', true);
      if (m.isValid()) return m.toDate().toISOString();
    }
    return undefined;
  }

  /** Tenta extrair um momento válido de InterventionReportModel */
  private pickTimestampFromIntervention(rep: InterventionReportModel): string | undefined {
    if (rep.timestamp) return rep.timestamp;
    if (rep.interventionDate) {
      const m = moment(rep.interventionDate, 'DD-MM-YYYY', true);
      if (m.isValid()) return m.toDate().toISOString();
    }
    return undefined;
  }

  /** Converte raw em moment() para fins de sort seguro */
  private tryToMoment(raw: ReportModel | InterventionReportModel): moment.Moment {
    const t1 = (raw as ReportModel).timestamp ?? (raw as InterventionReportModel).timestamp;
    if (t1 && moment(t1).isValid()) return moment(t1);

    const d1 = (raw as ReportModel).reportDate;
    if (d1 && moment(d1, 'DD-MM-YYYY', true).isValid()) return moment(d1, 'DD-MM-YYYY');

    const d2 = (raw as InterventionReportModel).interventionDate;
    if (d2 && moment(d2, 'DD-MM-YYYY', true).isValid()) return moment(d2, 'DD-MM-YYYY');

    return moment.invalid();
  }

  selectReport(card: ReportCard) {
    this.selected = card;
  }

  /** Helper para exibir índice com 1-based */
  idx(i: number): number {
    return i + 1;
  }

  clearAllRegisters(confirmUser: boolean = true): void {
    
    if (confirmUser && !window.confirm('Tem certeza que deseja limpar todos os registros? Essa ação não pode ser desfeita.')) {
      this.snackBar.open('Operação cancelada.', 'Fechar', { duration: 2500 });
      return;
    }

    try {
      localStorage.removeItem('reports');
      localStorage.removeItem('interventionReports');
      localStorage.removeItem('ReportInterventionList'); // legado

      this.reports = [];
      this.selected = undefined;

      this.snackBar.open('Registros apagados com sucesso.', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } catch (e) {
      this.snackBar.open('Falha ao limpar registros.', 'Fechar', {
        duration: 3000,
        panelClass: ['warn-snackbar']
      });
    }
  }



}
