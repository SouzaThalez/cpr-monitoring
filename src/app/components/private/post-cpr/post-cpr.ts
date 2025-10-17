import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { posPcrData } from '../../../data/posPcrData';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialog } from './save-dialog/save-dialog';

type LogKind = 'action' | 'finalize';

interface ActionItem {
  name: string;
  selected: boolean;
}

interface LogEntry {
  text: string;
  time: string;
  kind: LogKind;
  actionName?: string; // usado para vincular o log ao botão
}

interface GroupedActions {
  category: string;
  items: ActionItem[];
}

@Component({
  selector: 'app-post-cpr',
  templateUrl: './post-cpr.html',
  styleUrls: ['./post-cpr.scss'],
  standalone: false
})
export class PostCpr {
  // Ordem do protocolo pós-parada (AHA/fluxo prático)
  private readonly categoryOrder = [
    'Via aérea & Ventilação',
    'Hemodinâmica',
    'Temperatura',
    'Metabólico',
    'Sedação & UTI',
    'Organização do cuidado',
    'Outros'
  ];

  grouped: GroupedActions[] = [];
  logList: LogEntry[] = [];
  finalized = false;

  constructor(
    private matDialog: MatDialog,
  ){
    
    moment.locale('pt-br');

    // 1) Dedup mantendo ordem original
    const seen = new Set<string>();
    const actions: ActionItem[] = posPcrData
      .filter(x => {
        const k = x.name.trim();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .map(x => ({ name: x.name.trim(), selected: false }));

    // 2) Agrupar por categorias (regras por palavra-chave)
    const buckets = new Map<string, ActionItem[]>();
    this.categoryOrder.forEach(cat => buckets.set(cat, []));

    for (const a of actions) {
      const cat = this.categorize(a.name);
      if (!buckets.has(cat)) buckets.set(cat, []);
      buckets.get(cat)!.push(a);
    }

    // 3) Montar array final respeitando a ordem do protocolo
    this.grouped = this.categoryOrder
      .filter(cat => (buckets.get(cat)?.length ?? 0) > 0)
      .map(cat => ({ category: cat, items: buckets.get(cat)! }));
  }

  // Categorização simples por palavra-chave (case-insensitive)
  private categorize(name: string): string {

    
    const s = name.toLowerCase();

    // Via aérea & Ventilação
    if (
      s.includes('capnografia') ||
      s.includes('tubo') ||
      s.includes('iot') ||
      s.includes('hiperóxia') ||
      s.includes('hiperoxia') // caso sem acento
    ) {
      return 'Via aérea & Ventilação';
    }

    // Hemodinâmica
    if (
      s.includes('vasopressor') ||
      s.includes('inotrópico') ||
      s.includes('inotropico') ||
      s.includes('cristaloide') ||
      s.includes('lactato') ||
      s.includes('diurese')
    ) {
      return 'Hemodinâmica';
    }

    // Temperatura
    if (
      s.includes('temperatura') ||
      s.includes('febre')
    ) {
      return 'Temperatura';
    }

    // Metabólico
    if (
      s.includes('hipoglicemia') ||
      s.includes('hiperglicemia') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólito') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') || // redundâncias para garantir
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') ||
      s.includes('eletrólitos') || // (sim, repetido de propósito para cobrir variações)
      s.includes('eletr') // fallback genérico
    ) {
      return 'Metabólico';
    }

    // Sedação & UTI
    if (
      s.includes('sedação') ||
      s.includes('sedacao') ||
      s.includes('analgesia')
    ) {
      return 'Sedação & UTI';
    }

    // Organização do cuidado
    if (
      s.includes('centro especializado') ||
      s.includes('parada')
    ) {
      return 'Organização do cuidado';
    }

    return 'Outros';
  }

  trackByName = (_: number, item: ActionItem) => item.name;

  private now(): string {
    return moment().format('LT');
  }

  hasAnySelected(): boolean {
    return this.grouped.some(g => g.items.some(a => a.selected));
  }

  // Toggle + log: ao desmarcar, remove o log dessa ação
  toggleAction(a: ActionItem) {
    if (this.finalized) return;
    a.selected = !a.selected;

    if (a.selected) {
      // Adiciona log de seleção
      this.logList.unshift({
        text: `Selecionado: ${a.name}`,
        time: this.now(),
        kind: 'action',
        actionName: a.name
      });
    } else {
      // Remove o log mais recente correspondente a essa ação
      const idx = this.logList.findIndex(
        e => e.kind === 'action' && e.actionName === a.name
      );
      if (idx !== -1) this.logList.splice(idx, 1);
    }
  }

  // Remover um item do log manualmente (não mexe no estado do botão)
  removeLog(idx: number) {
    this.logList.splice(idx, 1);
  }

  finalizar() {

    if (this.finalized) return;

    const escolhidas = this.grouped
      .flatMap(g => g.items)
      .filter(a => a.selected)
      .map(a => `• ${a.name}`)
      .join('\n');

    this.logList.unshift({
      text: escolhidas ? `Finalizado. Ações selecionadas:\n${escolhidas}` : 'Finalizado. Sem ações selecionadas.',
      time: this.now(),
      kind: 'finalize'
    });
    this.openSaveDialog(escolhidas);
    this.finalized = true;
  }

  limpar() {
    this.grouped.forEach(g => g.items.forEach(a => (a.selected = false)));
    this.logList = [];
    this.finalized = false;
  }

    openSaveDialog(data: String) {

      const dialogRef = this.matDialog.open(SaveDialog, { disableClose: true });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
     
          const savedModel = data
          //this.saveReportToLocalStorage(reportModel);
        } else {
         
        }
      });
    }
  






}
