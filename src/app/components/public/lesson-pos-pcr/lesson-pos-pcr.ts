import { Component } from '@angular/core';
import { InterventionReportModel } from '../../../models/interventionReport';
import { Session } from '../../../models/session';
import moment from 'moment';
import { SaveDialog } from '../../private/post-cpr/save-dialog/save-dialog';
import { Intervention } from '../../../models/intervention';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { posPcrData } from '../../../data/posPcrData';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-lesson-pos-pcr',
  standalone: false,
  templateUrl: './lesson-pos-pcr.html',
  styleUrl: './lesson-pos-pcr.scss'
})
export class LessonPosPcr {

  interventions = posPcrData.firstIntervention;
  lapTimes: Intervention[] = [];
  sessionInfo?: Session;
  countItem = 0 ; 

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
    this.getSessionLocalStorage();

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
    this.countItem = this.countItem + 1; // cFaz o registro da ordem dos cliques (1°,2°...)

    const entry: Intervention = {
      timer: this.formatTime(),
      name: item.name,
      label: item.label || 'Intervenção',
      type: this.countItem.toString(),
    } as Intervention;
 
    this.lapTimes.push(entry);
  
  }

  removeLapItem(index: number, item: Intervention) {
    this.lapTimes.splice(index, 1);
    const found = this.interventions.find(d => d.name === item.name);
    if (found && found.cliked > 0) {
      found.cliked--;
    }
    this.countItem = this.countItem - 1;
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
          interventionInfo: this.sessionInfo!
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

  private getSessionLocalStorage() {
    const existing = localStorage.getItem('session');
    this.sessionInfo = existing ? JSON.parse(existing) as Session : undefined;
  }

  private submitReport() {

    const stored: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');
    if (!stored.length) {
      this.snackBar.open('Não há intervenções para salvar.', 'Fechar', { duration: 2500 });
      return;
    }

 
    //pega sempre o ultimo relatorio
    this.generateInterventionPdf(stored[stored.length - 1]);

    this.router.navigateByUrl('/lesson/aula-review');
  }

  private formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  private padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

 private generateInterventionPdf(model: InterventionReportModel) {

  const doc = new jsPDF();

  // ==========================
  // Título
  // ==========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Relatório de Cuidados Pós-PCR", 105, 20, { align: "center" });

  // ==========================
  // Descrição
  // ==========================
  doc.setFont("courier", "normal");
  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;

  const wrappedText = doc.splitTextToSize(
    "Este documento lista todos os procedimentos realizados após o retorno da circulação espontânea.",
    maxWidth
  );

  doc.text(wrappedText, margin, 30);

  // ==========================
  // Detalhes
  // ==========================
  doc.setFont("helvetica", "bold");
  doc.text("Detalhes:", 10, 50);

  const date = model.interventionDate || "-";
  const user = model.interventionInfo || {};

  doc.setFont("courier", "normal");

  doc.text(`- Data: ${date}`, 10, 60);
  doc.text(`- Professor: ${user.professor ?? "-"}`, 10, 70);
  doc.text(`- Aula: ${user.lesson ?? "-"}`, 10, 80);

  // ==========================
  // Cabeçalho da tabela
  // ==========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("Intervenções:", 10, 95);

  doc.setFillColor(230, 230, 230);
  doc.rect(10, 100, 190, 10, "F");

  doc.text("Ordem", 15, 107);
  doc.text("Intervenção", 45, 107);

  // ==========================
  // Linhas da tabela
  // ==========================
  let currentY = 110;
  const rowHeight = 10;
  const bottomMargin = 20;

  model.interventionList?.forEach((item: any) => {

    const ordem = item?.type ? `${item.type}°` : "-";
    const name = item?.name ? String(item.name) : "-";

    // Nova página
    if (currentY + rowHeight > pageHeight - bottomMargin) {

      doc.addPage();

      currentY = 20;

      doc.setFont("helvetica", "bold");
      doc.text("Intervenções (continuação):", 10, currentY);

      currentY += 5;

      doc.setFillColor(230, 230, 230);
      doc.rect(10, currentY, 190, 10, "F");

      doc.text("Ordem", 15, currentY + 7);
      doc.text("Intervenção", 45, currentY + 7);

      currentY += 10;
    }

    // Linha da tabela
    doc.rect(10, currentY, 190, rowHeight);

    doc.setFont("courier", "normal");

    doc.text(ordem, 15, currentY + 7);
    doc.text(name, 45, currentY + 7);

    currentY += rowHeight;
  });

  // ==========================
  // Rodapé
  // ==========================
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);

    doc.text(
      "Relatório gerado automaticamente em sistema",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // ==========================
  // Salvar PDF
  // ==========================
  doc.save("Relatorio-PosPCR.pdf");
}


}
