import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import moment from 'moment';
import { drugsPcrData } from '../../../data/drugsPcrData';
import { pcrRithmsData } from '../../../data/pcrRithmsData';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import { ReportModel } from '../../../models/report';
import { Intervention } from '../../../models/intervention';
import { SessionInfoDialog } from './session-info-dialog/session-info-dialog';
import { Session } from '../../../models/session';

@Component({
  selector: 'app-cpr-notes',
  standalone: false,
  templateUrl: './cpr-notes.html',
  styleUrls: ['./cpr-notes.scss']
})
export class CprNotes {


  @ViewChild('logList') logListRef!: ElementRef;

  drugs = drugsPcrData;
  rithms = pcrRithmsData;


  activeRithm: string = '';
  lapTimes: Intervention[] = [];

  running: boolean = false;
  time: number = 0;
  milliseconds: number = 0;
  private timer: any;
  initialTime: string = '';
  endTime: string = '';
  activeDrug: any = null;
  sessionInfo?: Session;

  constructor(
    private matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.restartApp();
    this.openSessionDialog();
  }

  startStopwatch() {


    moment.locale('pt-br');
    this.initialTime = moment().format('LT');

    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        this.milliseconds++;
        if (this.milliseconds >= 100) {
          this.milliseconds = 0;
          this.time++;
        }
      }, 10);
    }


  }

  stopStopwatch() {
    moment.locale('pt-br');
    this.endTime = moment().format('LT');
    this.running = false;
    this.activeRithm = '';
    clearInterval(this.timer);
    this.openConfirmDialog();
  }

  restartApp() {

    this.resetStopwatch();
    this.lapTimes = [];
    this.activeRithm = '';
    this.sessionInfo = undefined;

    this.drugs.rcpDrugs.forEach(element => {
      element.cliked = 0
    });

    this.drugs.interventions.forEach(element => {
      element.cliked = 0
    });

  }

  captureTime(drug: any) {

    drug.cliked = (drug.cliked || 0) + 1;
    const drugValue: Intervention = {
      timer: this.formatTime(),
      name: drug.name,
      type: drug.type,
      label: drug.label
    };
    this.lapTimes.push(drugValue);
  }

  removeLapItem(index: number, drug: any) {
    this.lapTimes.splice(index, 1);
    if (this.drugs.rcpDrugs.find(d => d.name === drug.name)) {
      this.drugs.rcpDrugs.find(d => d.name === drug.name)!.cliked--;
    }
    if (this.drugs.interventions.find(d => d.name === drug.name)) {
      this.drugs.interventions.find(d => d.name === drug.name)!.cliked--;
    }
  }


  setActiveDrug(drug: any) {
    this.activeDrug = drug;
  }


  getRithm(value: any) {
    this.activeRithm = value.name;
    this.lapTimes.push({
      timer: this.formatTime(),
      name: this.activeRithm,
      type: 'rithm',
      label: 'Check'
    });
  }


  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  private resetStopwatch() {
    clearInterval(this.timer);
    this.running = false;
    this.time = 0;
    this.milliseconds = 0;
  }


  private padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  private openConfirmDialog() {

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reportModel: ReportModel = {
          reportList: this.lapTimes,
          reportDate: moment().format('DD-MM-YYYY'),
          totalTimer: this.formatTime(),
          startTimer: this.initialTime,
          endTimer: this.endTime,
          user: this.sessionInfo!,
        };
        this.saveReportToLocalStorage(reportModel, this.sessionInfo!);
        this.generatePDF(reportModel);
      } else {
        this.startStopwatch();
      }
    });

  }

  private openSessionDialog() {

    const dialogRef = this.matDialog.open(SessionInfoDialog, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sessionInfo = result;
        console.log('Dados salvos:', this.sessionInfo);
      } else {
        this.router.navigateByUrl('/setup');
        console.log('Cancelado');
      }
    });
  }

  private saveReportToLocalStorage(model: ReportModel, session: Session) {

    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    existingReports.push(model);
    localStorage.setItem('reports', JSON.stringify(existingReports));

    //salva session apenas uma unica vez!
    localStorage.setItem('session', JSON.stringify(session));

    // redireciona para outra rota se desejar
    this.router.navigateByUrl('/private/cuidados-pos');
  }

  private generatePDF(model: ReportModel) {

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

    doc.setFont("helvetica", "bold");
    doc.text("Informações Gerais:", 10, 50);

    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    const leftX = 10;
    const rightX = 110;
    let y = 60;

    // Linha 1
    doc.text(`- Início: ${model.startTimer}`, leftX, y);
    doc.text(`- Avaliador: ${model.user.avaliator}`, rightX, y);

    // Linha 2
    y += 8;
    doc.text(`- Fim: ${model.endTimer}`, leftX, y);
    doc.text(`- Aluno: ${model.user.student}`, rightX, y);

    // Linha 3
    y += 8;
    doc.text(`- Tempo Total: ${model.totalTimer}`, leftX, y);
    doc.text(`- Grupo: ${model.user.group}`, rightX, y);

    // Linha 4
    y += 8;
    doc.text(`- Data: ${model.reportDate}`, leftX, y);

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

    let currentY = startY; // Track the current Y position

    model.reportList?.forEach((item: any) => {
      // If the row would overflow the page
      if (currentY + rowHeight > pageHeight - bottomMargin) {
        doc.addPage(); // Add a new page

        // Recreate the table header
        doc.setFont("helvetica", "bold");
        doc.text("Tabela de Intervenções (continuação):", 10, 20);
        doc.setFillColor(230, 230, 230);
        doc.rect(10, 25, 190, 10, "F");
        doc.text("Tempo", 15, 32);
        doc.text("Nome", 75, 32);
        doc.text("Tipo", 150, 32);

        // Reset currentY to start below the new header
        currentY = 35;
      }

      // Draw the row content
      doc.rect(10, currentY, 190, rowHeight);
      doc.text(item.timer, 15, currentY + 7);
      if (item.label) {
        doc.text(item.name + " " + item.label, 75, currentY + 7);
      } else {
        doc.text(item.name, 75, currentY + 7);
      }

      doc.text(item.type, 150, currentY + 7);

      // Move to the next row position
      currentY += rowHeight;
    });

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Relatório gerado automaticamente em sistema", 105, pageHeight - 10, { align: "center" });

    // Save the PDF
    doc.save("Relatorio-RCP.pdf");

  }

  private addLap(item: any) {
    this.lapTimes.push(item);
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() {
    const el = this.logListRef?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

}
