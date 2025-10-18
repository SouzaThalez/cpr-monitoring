import { Intervention } from "./intervention";

export interface InterventionReportModel {
  timestamp?: string; 
  interventionList?: Intervention[]   
  interventionDate?: string;            
  totalTimer?: string;                 
  startTimer?: string;                 
  endTimer?: string;                    
  user?: string;           
}             
