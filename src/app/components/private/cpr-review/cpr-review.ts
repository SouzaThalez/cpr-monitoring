import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { ReportCard } from '../../models/reportCard';
import { ReportModel } from '../../models/report';
import { Intervention } from '../../models/intervention';


@Component({
  selector: 'app-cpr-review',
  standalone: false,
  templateUrl: './cpr-review.html',
  styleUrls: ['./cpr-review.scss']
})
export class CprReview implements OnInit {

  reports: ReportCard[] = [];
  selected?: ReportCard;

  ngOnInit(): void {
    moment.locale('pt-br');
    this.loadFromLocalStorage();
  }

  /** Carrega e normaliza dados de localStorage (reports + ReportInterventionList) */
  private loadFromLocalStorage() {
    const parsedReports: ReportModel[] = this.safeParse<ReportModel[]>(localStorage.getItem('reports')) || [];
    const draftEntries = this.safeParse<Intervention[]>(localStorage.getItem('ReportInterventionList'));

    const cards: ReportCard[] = [];

    // 1) Histórico salvo em "reports"
    parsedReports.forEach((rep, idx) => {
      const entries = this.pickEntries(rep);
      const t = this.pickTimestamp(rep) ?? new Date().toISOString();
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

      const metaLine = this.makeMetaLine(rep);

      cards.push({
        id: `report-${idx}-${when.valueOf()}`,
        whenLabel,
        subtitle,
        metaLine,
        entries,
        raw: rep
      });
    });

    // 2) Rascunho atual em "ReportInterventionList" (opcional)
    if (draftEntries && Array.isArray(draftEntries) && draftEntries.length) {
      const when = moment();
      cards.unshift({
        id: `draft-${when.valueOf()}`,
        whenLabel: 'Em andamento',
        subtitle: `${draftEntries.length} intervenç${draftEntries.length === 1 ? 'ão' : 'ões'}`,
        entries: draftEntries,
        raw: {
          entries: draftEntries,
          reportList: draftEntries,
          reportDate: '',
          totalTimer: '',
          startTimer: '',
          endTimer: '',
          user: ''
        },
        isDraft: true
      });
    }

    this.reports = cards;
    this.selected = this.reports[0]; // seleciona o primeiro por padrão (rascunho se existir)
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

  /** Normaliza o array de intervenções, seja 'entries' ou 'reportList' */
  private pickEntries(rep: ReportModel): Intervention[] {
    if (Array.isArray(rep.entries)) return rep.entries;
    if (Array.isArray(rep.reportList)) return rep.reportList;
    return [];
  }

  /** Decide qual timestamp usar para label */
  private pickTimestamp(rep: ReportModel): string | undefined {
    if (rep.timestamp) return rep.timestamp;

    if (rep.reportDate) {
      // se vier 'DD-MM-YYYY', tenta converter para ISO com 12:00 local
      const m = moment(rep.reportDate, 'DD-MM-YYYY', true);
      if (m.isValid()) return m.toDate().toISOString();
    }
    return undefined;
  }

  /** Monta uma linha meta (opcional), se o modelo vier mais completo */
  private makeMetaLine(rep: ReportModel): string | undefined {
    const parts: string[] = [];
    if (rep.totalTimer) parts.push(`Total: ${rep.totalTimer}`);
    if (rep.startTimer) parts.push(`Início: ${rep.startTimer}`);
    if (rep.endTimer) parts.push(`Fim: ${rep.endTimer}`);
    if (rep.user) parts.push(`Usuário: ${rep.user}`);
    return parts.length ? parts.join(' • ') : undefined;
  }

  selectReport(card: ReportCard) {
    this.selected = card;
  }

  /** Helper para exibir índice com 1-based */
  idx(i: number): number {
    return i + 1;
  }
}
