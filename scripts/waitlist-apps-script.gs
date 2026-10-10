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


// id da planilha, o trecho da URL entre /d/ e /edit. Deixe vazio se o script
// foi criado pela própria planilha (Extensões > Apps Script)
const SPREADSHEET_ID = '';

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
  'Link do produto',
  'Link de acesso'
  
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


function jsonResponse(payload) {

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);

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
    entry.productUrl || '',
    entry.accessUrl || ''
  ]);

}


function getSheet() {

  // getActiveSpreadsheet() só responde quando o script é vinculado à planilha
  // (criado em Extensões > Apps Script). Script avulso precisa do ID.
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      'Planilha não encontrada. Preencha SPREADSHEET_ID com o id que aparece ' +
      'na URL da planilha, entre /d/ e /edit.'
    );
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  // cabeçalho é escrito na primeira inscrição e reescrito quando o script
  // passa a gravar colunas novas, para os dados não saírem desalinhados
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');

  return sheet;

}


// e-mail de confirmação para quem se inscreveu. Produto já publicado leva o
// link de acesso; os que ainda não têm link levam a página de apresentação
function sendConfirmation(entry) {

  const product = entry.productName || 'a plataforma';
  const released = Boolean(entry.accessUrl);

  const subject = released
    ? `Seu acesso ao ${product} está liberado`
    : 'Confirmamos a sua inscrição na lista de espera';

  const message = released
    ? `Recebemos a sua inscrição e o ${product} já está disponível: ` +
        'você pode começar a usar agora mesmo pelo link abaixo.'
    : `Recebemos a sua inscrição na lista de espera do ${product}. ` +
        'Avisaremos neste e-mail assim que o seu acesso estiver liberado.';

  const buttonUrl = released ? entry.accessUrl : entry.productUrl;
  const buttonLabel = released ? `Acessar o ${product}` : `Conhecer o ${product}`;

  const textLines = [
    `Olá, ${entry.name}!`,
    '',
    message
  ];

  if (buttonUrl) {
    textLines.push('', `${buttonLabel}: ${buttonUrl}`);
  }

  // quem já tem acesso recebe também a página do produto, como referência
  if (released && entry.productUrl) {
    textLines.push('', `Sobre o produto: ${entry.productUrl}`);
  }

  textLines.push('', `Equipe ${FROM_NAME}`);

  const htmlBody =
    '<div style="font-family:Roboto,Arial,sans-serif;color:#26364f;line-height:1.6">' +
      `<p>Olá, <strong>${escapeHtml(entry.name)}</strong>!</p>` +
      `<p>${escapeHtml(message)}</p>` +
      (buttonUrl
        ? `<p style="margin:26px 0"><a href="${escapeHtml(buttonUrl)}" ` +
            'style="background:#147fe8;color:#ffffff;padding:12px 22px;' +
            'border-radius:8px;text-decoration:none;font-weight:600;' +
            `display:inline-block">${escapeHtml(buttonLabel)}</a></p>`
        : '') +
      (released && entry.productUrl
        ? `<p style="font-size:14px">Quer saber mais? ` +
            `<a href="${escapeHtml(entry.productUrl)}" style="color:#147fe8">` +
            `Conheça o ${escapeHtml(product)}</a>.</p>`
        : '') +
      `<p style="color:#718096">Equipe ${escapeHtml(FROM_NAME)}</p>` +
    '</div>';

  MailApp.sendEmail({
    to: entry.email,
    subject: subject,
    body: textLines.join('\n'),
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
    `Link do produto: ${entry.productUrl || '-'}`,
    `Link de acesso: ${entry.accessUrl || '(produto ainda sem link)'}`
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
