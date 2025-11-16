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
import { Session } from '../../../models/session';

@Component({
  selector: 'app-post-cpr',
  templateUrl: './post-cpr.html',
  styleUrls: ['./post-cpr.scss'],
  standalone: false
})
export class PostCpr {

  interventions = posPcrData.firstIntervention;
  lapTimes: Intervention[] = [];
  sessionInfo?: Session;

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
          user: this.sessionInfo!
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
    doc.text("Tipo", 150, 102);

    let currentY = 110;
    const rowHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;

    model.interventionList?.forEach((item: any) => {

      // Sanitizar dados (evita jsPDF error)
      const timer = item?.timer ? String(item.timer) : "-";
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
