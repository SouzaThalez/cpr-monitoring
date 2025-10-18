import { Intervention } from "./intervention";

export interface ReportModel {
  reportList: Intervention[];
  reportDate: string;
  totalTimer: string;
  startTimer: string;
  endTimer: string;
  user: string;
}