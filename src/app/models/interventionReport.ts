import { Intervention } from "./intervention";
import { Session } from "./session";

export interface InterventionReportModel {
  timestamp?: string; 
  interventionList?: Intervention[]   
  interventionDate?: string;            
  totalTimer?: string;                 
  startTimer?: string;                 
  endTimer?: string;                    
  user: Session;              
}             
