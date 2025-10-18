import { Intervention } from "./intervention";
import { ReportModel } from "./report";

export interface ReportCard {
  id: string;                // chave única para o item
  whenLabel: string;         // ex.: '18/10/2025 08:42' (ou 'Hoje …')
  subtitle: string;          // ex.: '5 intervenções'
  metaLine?: string;         // ex.: 'Total: 12:34:56 • Início … • Fim …'
  entries: Intervention[];   // lista normalizada de intervenções
  raw: ReportModel;          // original
  isDraft?: boolean;         // se veio do ReportInterventionList
}