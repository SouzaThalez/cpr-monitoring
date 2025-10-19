import { Intervention } from "./intervention";
import { ReportModel } from "./report";
import { InterventionReportModel } from "./interventionReport";

export interface ReportCard {
  id: string;                       // chave única
  whenLabel: string;                // ex.: 'Hoje 12:30' ou '18/10/2025 08:42'
  subtitle: string;                 // ex.: '5 intervenções'
  entries: Intervention[];          // lista normalizada para o painel direito
  footerLabel: string;              // 'relatório da rcp' | 'relatório dos cuidados pos pcr'
  raw: ReportModel | InterventionReportModel;  // original (qualquer um dos dois)
  isDraft?: boolean;                // se for rascunho em andamento, se aplicável
}
