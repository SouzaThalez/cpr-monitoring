import { Intervention } from "./intervention";
import { ReportModel } from "./report";

export interface ReportCard {
  id: string;                // chave única para o item
  whenLabel: string;         // ex.: '18/10/2025 08:42' (ou 'Hoje …')
  subtitle: string;          // ex.: '5 intervenções'
  entries: Intervention[];   // lista normalizada de intervenções
  footerLabel: string;       // 'relatório da rcp' | 'relatório dos cuidados pos pcr'
  raw: Partial<ReportModel>; // original (parcial para aceitar variações)
  isDraft?: boolean;         // se veio do ReportInterventionList
}
