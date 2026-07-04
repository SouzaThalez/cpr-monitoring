import { Component } from '@angular/core';
import { drugsPcrData } from '../../../data/drugsPcrData';
import { pcrRithmsData } from '../../../data/pcrRithmsData';
import { Intervention } from '../../../models/intervention';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { ReportModel } from '../../../models/report';
import jsPDF from 'jspdf';
import { SubmitDialog } from './submit-dialog/submit-dialog';
import { InfoDialog } from './info-dialog/info-dialog';
import { Session } from '../../../models/session';

@Component({
  selector: 'app-lesson-cpr-notes',
  standalone: false,
  templateUrl: './lesson-cpr-notes.html',
  styleUrl: './lesson-cpr-notes.scss'
})
export class LessonCprNotes {

  drugs = drugsPcrData;
  rithms = pcrRithmsData;
  activeRithm: string = '';
  lapTimes: Intervention[] = [];

  sessionInfo?: Session;

  running: boolean = false;
  time: number = 0;
  milliseconds: number = 0;
  private timer: any;
  initialTime: string = '';
  endTime: string = '';
  activeDrug: any = null;
  lessonInfo: any;

  constructor(
    private matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void { 
    this.restartApp();
    this.openInfoDialog();
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
    this.openSubmitDialog();
  }

  restartApp() {
    this.resetStopwatch();
    this.lapTimes = [];
    this.activeRithm = '';
  }

  resetStopwatch() {
    clearInterval(this.timer);
    this.running = false;
    this.time = 0;
    this.milliseconds = 0;
  }

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
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

  openSubmitDialog() {

    const dialogRef = this.matDialog.open(SubmitDialog, { disableClose: true });
  
    dialogRef.afterClosed().subscribe(result => {
    
      if (result) {
        const reportModel: ReportModel = {
          reportList: this.lapTimes,
          reportDate: moment().format('DD-MM-YYYY'),
          totalTimer: this.formatTime(),
          startTimer: this.initialTime,
          endTimer: this.endTime,
          reportInfo: this.lessonInfo!,
        };
        this.saveReportToLocalStorage(reportModel , this.lessonInfo);
        // this.generatePDF(reportModel);
      } else {
        this.startStopwatch();
      }
    });
    
  }

  private openInfoDialog() {
    
  const dialogRef = this.matDialog.open(InfoDialog, {
    width: '400px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.lessonInfo = result;
    
    } else {
      console.log('Cancelado');
    }
  });
  }

  private saveReportToLocalStorage(model: ReportModel , session: Session) {
  debugger
    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    existingReports.push(model);
    localStorage.setItem('reports', JSON.stringify(existingReports));
    localStorage.setItem('session', JSON.stringify(session));

    this.generatePDF(model);

    // redireciona para outra rota se desejar
    this.router.navigateByUrl('/lesson/aula-pos-pcr');
  }

  private generatePDF(model: ReportModel) {

    const doc = new jsPDF();

    // ==========================
    // Título
    // ==========================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório da RCP", 105, 20, { align: "center" });

    // ==========================
    // Subtítulo
    // ==========================
    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;

    const wrappedText = doc.splitTextToSize(
      "Este é um registro formal de todas as intervenções realizadas durante a massagem cardíaca, seguindo as normas e guidelines mais recentes para obter o melhor resultado.",
      maxWidth
    );

    doc.text(wrappedText, margin, 30);

    // ==========================
    // Detalhes do relatório
    // ==========================
    let currentY = 50;

    doc.setFont("helvetica", "bold");
    doc.text("Detalhes do Relatório:", 10, currentY);

    doc.setFont("courier", "normal");

    currentY += 10;
    doc.text(`- Horário de início: ${model.startTimer}`, 10, currentY);

    currentY += 8;
    doc.text(`- Horário de finalização: ${model.endTimer}`, 10, currentY);

    currentY += 8;
    doc.text(`- Tempo total da parada: ${model.totalTimer}`, 10, currentY);

    currentY += 8;
    doc.text(`- Data de realização: ${model.reportDate}`, 10, currentY);

    currentY += 8;
    doc.text(`- Professor: ${model.reportInfo.professor}`, 10, currentY);

    currentY += 8;
    doc.text(`- Aula: ${model.reportInfo.lesson}`, 10, currentY);

    // ==========================
    // Espaço antes da tabela
    // ==========================
    currentY += 15;

    // ==========================
    // Cabeçalho da tabela
    // ==========================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Tabela de Intervenções:", 10, currentY);

    currentY += 5;

    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(10, currentY, 190, 10, "F");

    doc.text("Tempo", 15, currentY + 7);
    doc.text("Nome", 75, currentY + 7);
    doc.text("Tipo", 150, currentY + 7);

    // ==========================
    // Linhas da tabela
    // ==========================
    currentY += 10;

    const rowHeight = 10;
    const bottomMargin = 20;

    model.reportList?.forEach((item: any) => {

      // Verifica se precisa criar uma nova página
      if (currentY + rowHeight > pageHeight - bottomMargin) {

        doc.addPage();

        currentY = 20;

        doc.setFont("helvetica", "bold");
        doc.text("Tabela de Intervenções (continuação):", 10, currentY);

        currentY += 5;

        doc.setFillColor(230, 230, 230);
        doc.rect(10, currentY, 190, 10, "F");

        doc.text("Tempo", 15, currentY + 7);
        doc.text("Nome", 75, currentY + 7);
        doc.text("Tipo", 150, currentY + 7);

        currentY += 10;
      }

      doc.rect(10, currentY, 190, rowHeight);

      doc.setFont("courier", "normal");

      doc.text(item.timer, 15, currentY + 7);

      const name = item.label
        ? `${item.name} ${item.label}`
        : item.name;

      doc.text(name, 75, currentY + 7);

      doc.text(item.type, 150, currentY + 7);

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
    doc.save("Relatorio.pdf");

  }


}
