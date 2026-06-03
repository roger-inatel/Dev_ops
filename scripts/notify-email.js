#!/usr/bin/env node
/* eslint-disable */
/**
 * notify-email.js
 *
 * Envia um e-mail de resumo da execucao do pipeline.
 *
 * Atende ao Projeto S07 NP2:
 *  - Notificacao de usuarios (e-mail) -> obrigatoria na pipeline
 *  - "O endereco de e-mail NAO pode estar fixado (hardcoded) - deve ser
 *     uma variavel de ambiente": le NOTIFY_EMAIL do ambiente.
 *
 * Como o Jenkins/Compose deve chamar:
 *   node scripts/notify-email.js
 *
 * Variaveis de ambiente lidas:
 *   Obrigatoria:
 *     NOTIFY_EMAIL    - destinatario(s), separados por virgula.
 *   SMTP (com defaults mirando o servico mailhog do docker-compose.yml):
 *     SMTP_HOST       - default: mailhog
 *     SMTP_PORT       - default: 1025
 *     SMTP_USER       - opcional
 *     SMTP_PASS       - opcional
 *     SMTP_SECURE     - 'true' liga TLS (default false, pq mailhog nao tem TLS)
 *     SMTP_FROM       - default: jenkins@adotapet.local
 *   Contexto do build (Jenkins injeta automaticamente):
 *     BUILD_STATUS    - SUCCESS | FAILURE | UNSTABLE | etc.
 *     BUILD_NUMBER, BUILD_URL, JOB_NAME, GIT_BRANCH, GIT_COMMIT
 *
 * Codigos de saida:
 *   0  - e-mail enviado.
 *   1  - faltou NOTIFY_EMAIL no ambiente (pipeline NAO deve silenciar).
 *   2  - falha SMTP (host inacessivel, autenticacao etc).
 */

'use strict';

const nodemailer = require('nodemailer');

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`[notify-email] ERRO: variavel de ambiente ${name} ausente.`);
    console.error(`[notify-email] Defina ${name} antes de chamar este script.`);
    process.exit(1);
  }
  return v.trim();
}

function optional(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

async function main() {
  const to       = required('NOTIFY_EMAIL');                       // <-- nao hardcoded
  const host     = optional('SMTP_HOST', 'mailhog');
  const port     = Number(optional('SMTP_PORT', '1025'));
  const user     = optional('SMTP_USER', '');
  const pass     = optional('SMTP_PASS', '');
  const secure   = optional('SMTP_SECURE', 'false').toLowerCase() === 'true';
  const from     = optional('SMTP_FROM', 'jenkins@adotapet.local');

  const status   = optional('BUILD_STATUS',  'UNKNOWN');
  const job      = optional('JOB_NAME',      'adotapet-pipeline');
  const number   = optional('BUILD_NUMBER',  '?');
  const url      = optional('BUILD_URL',     '');
  const branch   = optional('GIT_BRANCH',    '?');
  const commit   = optional('GIT_COMMIT',    '?');
  const stamp    = new Date().toISOString();

  const subject  = `[AdotaPet][${status}] ${job} #${number}`;

  const textBody =
`Pipeline AdotaPet concluida.

Job:        ${job}
Build:      #${number}
Status:     ${status}
Branch:     ${branch}
Commit:     ${commit}
Disparado:  ${stamp}
${url ? 'URL:        ' + url : ''}

Artefatos (pacote + relatorio de testes) ficam disponiveis na pagina do build no Jenkins.

-- Pipeline AdotaPet (Projeto S07 NP2 / INATEL)`;

  const htmlBody =
`<h2>Pipeline AdotaPet concluida</h2>
<table cellpadding="6" style="font-family:monospace;border-collapse:collapse;">
  <tr><td><b>Job</b></td><td>${job}</td></tr>
  <tr><td><b>Build</b></td><td>#${number}</td></tr>
  <tr><td><b>Status</b></td><td><b>${status}</b></td></tr>
  <tr><td><b>Branch</b></td><td>${branch}</td></tr>
  <tr><td><b>Commit</b></td><td>${commit}</td></tr>
  <tr><td><b>Disparado</b></td><td>${stamp}</td></tr>
  ${url ? `<tr><td><b>URL</b></td><td><a href="${url}">${url}</a></td></tr>` : ''}
</table>
<p>Artefatos (pacote + relatorio de testes) na pagina do build no Jenkins.</p>
<p style="color:#888"><i>Pipeline AdotaPet (Projeto S07 NP2 / INATEL)</i></p>`;

  const transport = nodemailer.createTransport({
    host, port, secure,
    auth: user && pass ? { user, pass } : undefined,
    // mailhog nao usa TLS; permite conexoes "inseguras" no dev local.
    tls: { rejectUnauthorized: false },
  });

  console.log(`[notify-email] enviando para "${to}" via ${host}:${port} (secure=${secure})...`);

  try {
    const info = await transport.sendMail({
      from, to, subject,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[notify-email] OK - messageId=${info.messageId} response=${info.response}`);
    process.exit(0);
  } catch (err) {
    console.error('[notify-email] FALHA ao enviar e-mail:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(2);
  }
}

main();
