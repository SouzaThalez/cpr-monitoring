import { Intervention } from "./intervention";

export interface ReportModel {
  timestamp?: string;       //(quando o relatório foi salvo)
  reportList?: Intervention[]   
  reportDate?: string;            
  totalTimer?: string;                 
  startTimer?: string;                 
  endTimer?: string;                    
  user?: string;           
}             
