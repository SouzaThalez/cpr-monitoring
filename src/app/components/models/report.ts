import { Intervention } from "./intervention";

export interface ReportModel {
  timestamp?: string;        
  entries?: Intervention[];
  reportList: Intervention[];
  reportDate: string;
  totalTimer: string;
  startTimer: string;
  endTimer: string;
  user: string;
}