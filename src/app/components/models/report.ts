import { Intervention } from "./intervention";

export interface ReportModel {
  timestamp?: string;           // ISO
  entries?: Intervention[];     // usado pela RCP
  reportList?: Intervention[];  // usado pelos cuidados pós-PCR
  reportDate?: string;          // 'DD-MM-YYYY'
  totalTimer?: string;
  startTimer?: string;
  endTimer?: string;
  user?: string;
}
