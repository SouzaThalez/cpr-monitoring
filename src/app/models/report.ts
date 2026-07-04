import { Intervention } from "./intervention";
import { Session } from "./session";

export interface ReportModel {
  timestamp?: string;       //(quando o relatório foi salvo)
  reportList?: Intervention[]   
  reportDate?: string;            
  totalTimer?: string;                 
  startTimer?: string;                 
  endTimer?: string;                    
  reportInfo: Session;           
}             
