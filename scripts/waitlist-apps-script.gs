/**
 * =====================================================================
 * LISTA DE ESPERA — endpoint do Google Apps Script
 * =====================================================================
 *
 * O que faz: recebe o cadastro do formulário em /lista-espera, grava uma
 * linha na planilha e envia dois e-mails — a confirmação para quem se
 * inscreveu (com o link do produto escolhido) e o aviso para você.
 *
 * COMO PUBLICAR
 *
 * 1. Crie uma planilha nova no Google Sheets (ela guardará a lista).
 * 2. Nessa planilha: Extensões > Apps Script.
 * 3. Apague o conteúdo do Code.gs e cole este arquivo inteiro.
 * 4. Ajuste as constantes abaixo (NOTIFY_EMAIL e FROM_NAME) se quiser.
 * 5. Salve e clique em Implantar > Nova implantação.
 *      - Tipo: App da Web
 *      - Executar como: Eu (sua conta)
 *      - Quem pode acessar: Qualquer pessoa          <-- obrigatório
 * 6. Autorize o script quando o Google pedir (ele avisa que o app não é
 *    verificado: "Avançado" > "Acessar <nome do projeto>").
 * 7. Copie a URL gerada, que termina em /exec, e cole em
 *    src/app/services/waitlist-service.ts, na constante waitlistEndpoint.
 *
 * Teste rápido: abra a URL /exec no navegador. Um GET devolve
 * {"ok":true,"service":"waitlist"} — se aparecer isso, o endpoint está no ar.
 *
 * IMPORTANTE: cada alteração neste script só vale no site depois de
 * "Implantar > Gerenciar implantações > editar (lápis) > Versão: Nova versão".
 *
 * Limite de envio: contas Gmail gratuitas têm cota de ~100 destinatários por
 * dia no MailApp (contas Workspace, ~1500). Cada cadastro usa 2 envios.
 */


// aba da planilha onde as inscrições são gravadas; é criada se não existir
const SHEET_NAME = 'Lista de espera';

// destinatário do aviso interno; vazio = a conta que publicou o script
const NOTIFY_EMAIL = '';

// nome que aparece como remetente dos e-mails
const FROM_NAME = 'Selath Innovation';

const HEADERS = [
  'Data',
  'Produto',
  'Nome',
  'Instituição',
  'Cargo',
  'E-mail',
  'Finalidade',
  'Link do produto'
];


/**
 * O formulário envia o corpo como text/plain para não disparar o preflight
 * do CORS, que o Apps Script não responde. Por isso o JSON vem cru em
 * e.postData.contents.
 */
function doPost(e) {

  try {

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Corpo da requisição vazio' });
    }

    const entry = JSON.parse(e.postData.contents);

    if (!entry.email || !entry.name) {
      return jsonResponse({ ok: false, error: 'Nome e e-mail são obrigatórios' });
    }

    appendEntry(entry);

    sendConfirmation(entry);
    sendNotification(entry);

    return jsonResponse({ ok: true });

  } catch (error) {

    console.error(error);

    return jsonResponse({ ok: false, error: String(error) });

  }

}


// serve só para conferir no navegador se a implantação está no ar
function doGet() {
  return jsonResponse({ ok: true, service: 'waitlist' });
}


function appendEntry(entry) {

  const sheet = getSheet();

  sheet.appendRow([
    new Date(),
    entry.productName || '',
    entry.name || '',
    entry.institution || '',
    entry.role || '',
    entry.email || '',
    entry.purpose || '',
    entry.productUrl || ''
  ]);

}


function getSheet() {

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  // cabeçalho é escrito uma única vez, na primeira inscrição
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;

}


// e-mail de confirmação para quem se inscreveu, com o link do produto
function sendConfirmation(entry) {

  const product = entry.productName || 'a plataforma';

  const subject = 'Confirmamos a sua inscrição na lista de espera';

  const lines = [
    `Olá, ${entry.name}!`,
    '',
    `Recebemos a sua inscrição na lista de espera do ${product}. ` +
      'Avisaremos neste e-mail assim que o seu acesso estiver liberado.',
    '',
    entry.productUrl ? `Conheça o produto: ${entry.productUrl}` : '',
    '',
    `Equipe ${FROM_NAME}`
  ];

  const htmlBody =
    '<div style="font-family:Roboto,Arial,sans-serif;color:#26364f;line-height:1.6">' +
      `<p>Olá, <strong>${escapeHtml(entry.name)}</strong>!</p>` +
      `<p>Recebemos a sua inscrição na lista de espera do ` +
        `<strong>${escapeHtml(product)}</strong>. Avisaremos neste e-mail ` +
        'assim que o seu acesso estiver liberado.</p>' +
      (entry.productUrl
        ? `<p style="margin:26px 0"><a href="${escapeHtml(entry.productUrl)}" ` +
            'style="background:#147fe8;color:#ffffff;padding:12px 22px;' +
            'border-radius:8px;text-decoration:none;font-weight:600;' +
            'display:inline-block">Conhecer o ' + escapeHtml(product) + '</a></p>'
        : '') +
      `<p style="color:#718096">Equipe ${escapeHtml(FROM_NAME)}</p>` +
    '</div>';

  MailApp.sendEmail({
    to: entry.email,
    subject: subject,
    body: lines.join('\n'),
    htmlBody: htmlBody,
    name: FROM_NAME
  });

}


// aviso interno a cada nova inscrição
function sendNotification(entry) {

  const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();

  if (!to) {
    return;
  }

  const body = [
    `Produto: ${entry.productName || '-'}`,
    `Nome: ${entry.name || '-'}`,
    `Instituição: ${entry.institution || '-'}`,
    `Cargo: ${entry.role || '-'}`,
    `E-mail: ${entry.email || '-'}`,
    `Finalidade: ${entry.purpose || '-'}`,
    `Link do produto: ${entry.productUrl || '-'}`
  ].join('\n');

  MailApp.sendEmail({
    to: to,
    subject: `Nova inscrição na lista de espera — ${entry.productName || 'produto'}`,
    body: body,
    name: FROM_NAME
  });

}


function escapeHtml(value) {

  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

}
