import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * URL do Web App do Google Apps Script que grava a inscrição na planilha e
 * dispara os e-mails. Gerada em "Implantar > Nova implantação > App da Web"
 * e termina em /exec. O código do script está em scripts/waitlist-apps-script.gs.
 */
export const waitlistEndpoint = 'https://script.google.com/macros/s/AKfycbyBe6-ErG-xTUMcbAb_uMa2UnLbZB0w-gOxL60wSUY2k4jcDkYH7l1HHA7RfaLL5-nWIQ/exec';

export interface WaitlistEntry {
  name: string;
  institution: string;
  role: string;
  email: string;
  purpose: string;
  productName: string;
  productSlug: string;
  productUrl: string;
  accessUrl: string;
}

@Injectable({ providedIn: 'root' })
export class WaitlistService {

  constructor(private http: HttpClient) {}


  /**
   * O Apps Script não responde ao preflight do CORS, então o corpo vai como
   * text/plain: isso mantém a requisição "simples" e o navegador não dispara
   * o OPTIONS. O script faz o JSON.parse do conteúdo do lado dele.
   */
  register(entry: WaitlistEntry): Observable<string> {

    return this.http.post(waitlistEndpoint, JSON.stringify(entry), {
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      responseType: 'text'
    });

  }

}
