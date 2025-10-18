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

  /** Carrega e normaliza dados de localStorage (reports + interventionReports/ReportInterventionList) */
  private loadFromLocalStorage() {
    
    const parsedReports: ReportModel[] =
      this.safeParse<ReportModel[]>(localStorage.getItem('reports')) || [];

    // rascunho atual: nova key 'interventionReports' (fallback antigo 'ReportInterventionList')
    const draftEntries: Intervention[] =
      this.safeParse<Intervention[]>(localStorage.getItem('interventionReports'))
        ?? this.safeParse<Intervention[]>(localStorage.getItem('ReportInterventionList'))
        ?? [];

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

      // Origem para o footer:
      const footerLabel =
        Array.isArray(rep.reportList) && rep.reportList.length
          ? 'relatório dos cuidados pos pcr'
          : 'relatório da rcp';

      cards.push({
        id: `report-${idx}-${when.valueOf()}`,
        whenLabel,
        subtitle,
        entries,
        footerLabel,
        raw: rep
      });
    });

    // 2) Rascunho atual (opcional) -> cuidados pós-PCR
    if (Array.isArray(draftEntries) && draftEntries.length) {
      const when = moment();
      cards.unshift({
        id: `draft-${when.valueOf()}`,
        whenLabel: 'Em andamento',
        subtitle: `${draftEntries.length} intervenç${draftEntries.length === 1 ? 'ão' : 'ões'}`,
        entries: draftEntries,
        footerLabel: 'relatório dos cuidados pos pcr',
        raw: {
          // Mantemos forma compatível para não quebrar nenhum código que leia raw:
          reportList: draftEntries,
          reportDate: '',
          totalTimer: '',
          startTimer: '',
          endTimer: '',
          user: '',
          timestamp: new Date().toISOString()
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

  /** Normaliza o array de intervenções, preferindo 'reportList'. Mantém compatibilidade com 'entries'. */
  private pickEntries(rep: ReportModel): Intervention[] {
    if (Array.isArray(rep.reportList) && rep.reportList.length) return rep.reportList;

    // compatibilidade com registros antigos (se existirem):
    // @ts-expect-error – alguns registros antigos podem ter 'entries' com shape compatível
    if (Array.isArray(rep.entries) && rep.entries.length) return rep.entries as InterventionReportEntry[];

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

  selectReport(card: ReportCard) {
    this.selected = card;
  }

  /** Helper para exibir índice com 1-based */
  idx(i: number): number {
    return i + 1;
  }
}
