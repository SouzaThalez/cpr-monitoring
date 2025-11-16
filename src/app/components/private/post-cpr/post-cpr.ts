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
          user: 'padrão'
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

  private submitReport() {

    const stored: InterventionReportModel[] = JSON.parse(localStorage.getItem('interventionReports') || '[]');
debugger
    if (!stored.length) {
      this.snackBar.open('Não há intervenções para salvar.', 'Fechar', { duration: 2500 });
      return;
    }

  
  //  this.generatePDF(stored);

    this.router.navigateByUrl('/private/pcr-review');
  }

  private generatePDF(model: InterventionReportModel) {

    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório da RCP", 105, 20, { align: "center" });

    // Subtitle
    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;

    const wrappedText = doc.splitTextToSize(
      "Este é um registro formal de todas as intervenções realizadas durante a massagem cardíaca, seguindo as normas e guidelines mais recentes para obter o melhor resultado.",
      maxWidth
    );
    doc.text(wrappedText, margin, 30);

    // Report Details
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes do Relatório:", 10, 50);
    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    doc.text(`- Horário de início: ${model.startTimer ?? "--:--"}`, 10, 60);
    doc.text(`- Horário de finalização: ${model.endTimer ?? "--:--"}`, 10, 68);
    doc.text(`- Tempo total da parada: ${model.totalTimer ?? "--:--"}`, 10, 76);
    doc.text(`- Data de realização: ${model.interventionDate}`, 10, 84);
    doc.text(`- Usuário: ${model.user}`, 10, 92);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Tabela de Intervenções:", 10, 100);
    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(10, 105, 190, 10, "F");

    doc.text("Tempo", 15, 112);
    doc.text("Nome", 75, 112);
    doc.text("Tipo", 150, 112);

    // Table Rows
    let startY = 115;
    const rowHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;

    let currentY = startY;

    model.interventionList?.forEach((item: any) => {

      if (currentY + rowHeight > pageHeight - bottomMargin) {
        doc.addPage();

        doc.setFont("helvetica", "bold");
        doc.text("Tabela de Intervenções (continuação):", 10, 20);
        doc.setFillColor(230, 230, 230);
        doc.rect(10, 25, 190, 10, "F");

        doc.text("Tempo", 15, 32);
        doc.text("Nome", 75, 32);
        doc.text("Tipo", 150, 32);

        currentY = 35;
      }

      doc.rect(10, currentY, 190, rowHeight);

      // timer
      doc.text(item.timer ?? "--:--", 15, currentY + 7);

      // nome + label
      const nameText = item.label ? `${item.name} ${item.label}` : item.name;
      doc.text(nameText, 75, currentY + 7);

      // tipo
      doc.text(item.label ?? "-", 150, currentY + 7);

      currentY += rowHeight;
    });

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(
      "Relatório gerado automaticamente em sistema",
      105,
      pageHeight - 10,
      { align: "center" }
    );

    // Save
    doc.save(`pcr_report_${Date.now()}.pdf`);
  }

  private formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  private padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }



}
