import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';

import { ReportCard } from '../../../models/reportCard';
import { ReportModel } from '../../../models/report';
import { InterventionReportModel } from '../../../models/interventionReport';
import { MatSnackBar } from '@angular/material/snack-bar';

// IMPORT PDF
import jsPDF from 'jspdf';

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

  /** Carrega e normaliza dados de localStorage */
  private loadFromLocalStorage() {
    const parsedReports: ReportModel[] =
      this.safeParse<ReportModel[]>(localStorage.getItem('reports')) || [];

    const interventionReports: InterventionReportModel[] =
      this.safeParse<InterventionReportModel[]>(localStorage.getItem('interventionReports')) || [];

    const cards: ReportCard[] = [];

    // Pós-PCR
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
        footerLabel: 'Cuidados pós pcr',
        raw: rep,
      });
    });

    // RCP
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
        footerLabel: 'Ciclo da rcp',
        raw: rep
      });
    });

    // Ordenar do mais recente
    cards.sort((a, b) => {
      const ta = this.tryToMoment(a.raw).valueOf();
      const tb = this.tryToMoment(b.raw).valueOf();
      return tb - ta;
    });

    this.reports = cards;
    this.selected = this.reports[0];
  }

  private safeParse<T>(json: string | null): T | null {
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  private pickTimestampFromReport(rep: ReportModel): string | undefined {
    if (rep.timestamp) return rep.timestamp;
    if (rep.reportDate) {
      const m = moment(rep.reportDate, 'DD-MM-YYYY', true);
      if (m.isValid()) return m.toDate().toISOString();
    }
    return undefined;
  }

  private pickTimestampFromIntervention(rep: InterventionReportModel): string | undefined {
    if (rep.timestamp) return rep.timestamp;
    if (rep.interventionDate) {
      const m = moment(rep.interventionDate, 'DD-MM-YYYY', true);
      if (m.isValid()) return m.toDate().toISOString();
    }
    return undefined;
  }

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
      localStorage.removeItem('ReportInterventionList');

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

  // ---------------------------------------------------------
  // -------------------- DOWNLOAD PDF ------------------------
  // ---------------------------------------------------------

  DownloadPdf() {

    if (!this.selected) {
      this.snackBar.open('Selecione um registro para gerar o PDF.', 'Fechar', { duration: 3000 });
      return;
    }

    const raw = this.selected.raw;

    // Detecta automaticamente o tipo do registro
    if ((raw as ReportModel).reportList) {
      this.generateRcpPdf(raw as ReportModel);
    } else if ((raw as InterventionReportModel).interventionList) {
      this.generateInterventionPdf(raw as InterventionReportModel);
    } else {
      this.snackBar.open('Registro inválido.', 'Fechar', { duration: 3000 });
    }
  }

  // ---------------------------------------------------------
  // PDF RCP
  // ---------------------------------------------------------

  private generateRcpPdf(model: ReportModel) {
   
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório da RCP", 105, 20, { align: "center" });

    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;

    const wrappedText = doc.splitTextToSize(
      "Este é um registro formal de todas as intervenções realizadas durante a massagem cardíaca.",
      maxWidth
    );
    doc.text(wrappedText, margin, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Detalhes do Relatório:", 10, 50);
    doc.setFont("courier", "normal");
    doc.text(`- Início: ${model.startTimer}`, 10, 60);
    doc.text(`- Fim: ${model.endTimer}`, 10, 68);
    doc.text(`- Tempo total: ${model.totalTimer}`, 10, 76);
    doc.text(`- Data: ${model.reportDate}`, 10, 84);
    doc.text(`- Usuário: ${model.user}`, 10, 92);

    // Cabeçalho tabela
    doc.setFont("helvetica", "bold");
    doc.text("Tabela de Intervenções:", 10, 100);

    doc.setFillColor(230, 230, 230);
    doc.rect(10, 105, 190, 10, "F");

    doc.text("Tempo", 15, 112);
    doc.text("Nome", 75, 112);
    doc.text("Tipo", 150, 112);

    let currentY = 115;
    const rowHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;

    model.reportList?.forEach((item: any) => {
      if (currentY + rowHeight > pageHeight - bottomMargin) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.text("Tabela (continuação):", 10, 20);
        doc.rect(10, 25, 190, 10, "F");

        doc.text("Tempo", 15, 32);
        doc.text("Nome", 75, 32);
        doc.text("Tipo", 150, 32);

        currentY = 35;
      }

      doc.rect(10, currentY, 190, rowHeight);
      doc.text(item.timer, 15, currentY + 7);
      doc.text(item.name + " " + (item.label || ""), 75, currentY + 7);
      doc.text(item.type, 150, currentY + 7);

      currentY += rowHeight;
    });

    doc.save("Relatorio-RCP.pdf");
  }

  // ---------------------------------------------------------
  // PDF Pós-PCR
  // ---------------------------------------------------------

 private generateInterventionPdf(model: InterventionReportModel) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Relatório de Cuidados Pós-PCR", 105, 20, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.width;
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;

  const wrappedText = doc.splitTextToSize(
    "Este documento lista todos os procedimentos realizados após o retorno da circulação espontânea.",
    maxWidth
  );
  doc.text(wrappedText, margin, 30);

  doc.setFont("helvetica", "bold");
  doc.text("Detalhes:", 10, 50);

  // Garantir strings
  const date = model.interventionDate || "-";
  const user = model.user || "-";

  doc.setFont("courier", "normal");
  doc.text(`- Data: ${date}`, 10, 60);
  doc.text(`- Usuário: ${user}`, 10, 70);

  // Cabeçalho tabela
  doc.setFont("helvetica", "bold");
  doc.text("Intervenções:", 10, 90);

  doc.setFillColor(230, 230, 230);
  doc.rect(10, 95, 190, 10, "F");

  doc.text("Tempo", 15, 102);
  doc.text("Nome", 75, 102);


  let currentY = 110;
  const rowHeight = 10;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 20;

  model.interventionList?.forEach((item: any, index: number) => {

    // Sanitizar dados (evita jsPDF error)
   const timer = `${(index + 1)}°`;
    const name = item?.name ? String(item.name) : "-";
    const label = item?.label ? String(item.label) : "";
    const type = item?.type ? String(item.type) : "-";

    if (currentY + rowHeight > pageHeight - bottomMargin) {
      doc.addPage();

      doc.setFont("helvetica", "bold");
      doc.text("Intervenções (cont.):", 10, 20);
      doc.rect(10, 25, 190, 10, "F");
      doc.text("Tempo", 15, 32);
      doc.text("Nome", 75, 32);
      doc.text("Tipo", 150, 32);

      currentY = 35;
    }

    // Linha normalizada
    doc.rect(10, currentY, 190, rowHeight);

    doc.text(timer, 15, currentY + 7);
    doc.text(`${name} ${label}`.trim(), 75, currentY + 7);
    doc.text(type, 150, currentY + 7);

    currentY += rowHeight;
  });

  doc.save("Relatorio-PosPCR.pdf");
}


}
