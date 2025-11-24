
import { APR, Inspection, RiskControl } from '../types';

const getBaseLayout = (title: string, content: string) => {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #111; line-height: 1.4; -webkit-print-color-adjust: exact; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
          .brand span { color: #064e3b; } /* Emerald 900 */
          .doc-title { text-align: right; }
          .doc-title h1 { font-size: 16px; margin: 0; text-transform: uppercase; }
          .doc-title p { font-size: 9px; color: #666; margin: 0; }
          
          .section-title { background-color: #f0fdf4; color: #064e3b; padding: 5px 10px; font-weight: bold; text-transform: uppercase; font-size: 10px; border-left: 4px solid #10b981; margin: 20px 0 10px 0; }
          
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; }
          .field { margin-bottom: 5px; }
          .label { font-size: 8px; text-transform: uppercase; color: #666; font-weight: bold; display: block; }
          .value { font-size: 12px; font-weight: 500; border-bottom: 1px solid #eee; padding-bottom: 2px; width: 100%; display: block; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; table-layout: fixed; }
          th { background-color: #1f2937; color: white; text-align: left; padding: 6px; font-weight: bold; text-transform: uppercase; font-size: 9px; }
          td { padding: 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; word-wrap: break-word;}
          tr:nth-child(even) { background-color: #f9fafb; }
          
          .status-badge { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 9px; display: inline-block; }
          .status-c { color: #065f46; background-color: #d1fae5; border: 1px solid #a7f3d0; }
          .status-nc { color: #7f1d1d; background-color: #fee2e2; border: 1px solid #fecaca; }
          .status-na { color: #374151; background-color: #f3f4f6; border: 1px solid #e5e7eb; }

          .evidence-box { margin-top: 8px; border: 1px solid #eee; padding: 4px; background: #fff; display: inline-block; }
          .evidence-img { max-height: 120px; max-width: 100%; display: block; }
          .comment-text { font-style: italic; color: #555; margin-top: 4px; font-size: 9px; }

          .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; page-break-inside: avoid; }
          .sig-box { border-top: 1px solid #000; padding-top: 5px; text-align: center; }
          .sig-name { font-weight: bold; font-size: 10px; display: block; }
          .sig-role { font-size: 8px; color: #666; display: block; }
          .sig-img { max-height: 40px; display: block; margin: 0 auto 5px auto; }
          
          .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">SafeGuard <span>Pro</span></div>
          <div class="doc-title">
            <h1>${title}</h1>
            <p>Documento Gerado Eletronicamente</p>
          </div>
        </div>
        ${content}
        <div class="footer">
          SafeGuard Pro • Sistema de Gestão SST • Gerado em ${new Date().toLocaleString('pt-BR')}
        </div>
        <script>
          window.onload = () => { setTimeout(() => window.print(), 800); }
        </script>
      </body>
    </html>
  `;
};

export const printAPR = (apr: APR) => {
  const risksRows = apr.risks.map(r => `
    <tr>
      <td style="font-weight:bold; color:#b91c1c;">${r.risk}</td>
      <td>${r.control}</td>
      <td>${r.ppe.join(', ')}</td>
    </tr>
  `).join('');

  const signatures = [...apr.teamSignatures];
  if (apr.approverSignature) signatures.push(apr.approverSignature);

  const sigHtml = signatures.map(s => `
    <div class="sig-box">
      <div style="font-family: 'Courier New'; font-size: 9px; color: ${s.signed ? 'green' : 'red'}; margin-bottom: 5px;">
        ${s.signed ? '[ ASSINADO DIGITALMENTE ]' : '[ PENDENTE ]'}
      </div>
      <span class="sig-name">${s.name}</span>
      <span class="sig-role">${s.role}</span>
      <span style="font-size: 8px; display:block;">${s.date || ''}</span>
    </div>
  `).join('');

  const content = `
    <div class="section-title">Dados da Atividade</div>
    <div class="grid">
      <div class="field"><span class="label">ID da APR</span><span class="value">#${apr.id}</span></div>
      <div class="field"><span class="label">Status</span><span class="value">${apr.status}</span></div>
      <div class="field"><span class="label">Tarefa</span><span class="value">${apr.taskName}</span></div>
      <div class="field"><span class="label">Data</span><span class="value">${apr.date}</span></div>
      <div class="field"><span class="label">Local</span><span class="value">${apr.location}</span></div>
      <div class="field"><span class="label">Projeto</span><span class="value">Obra Alpha (Ref: ${apr.projectId})</span></div>
    </div>

    <div class="field">
      <span class="label">Descrição Detalhada</span>
      <div class="value" style="height: auto; border: 1px solid #eee; background: #fafafa; padding: 10px; margin-top: 5px;">
        ${apr.description}
      </div>
    </div>

    <div class="section-title">Análise de Riscos (APR)</div>
    <table>
      <thead>
        <tr>
          <th width="30%">Perigo / Risco</th>
          <th width="40%">Medidas de Controle</th>
          <th width="30%">EPIs Obrigatórios</th>
        </tr>
      </thead>
      <tbody>
        ${risksRows || '<tr><td colspan="3" style="text-align:center; padding: 20px;">Nenhum risco registrado.</td></tr>'}
      </tbody>
    </table>

    <div class="section-title">Assinaturas e Validações</div>
    <div class="signatures">
      ${sigHtml}
    </div>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(getBaseLayout(`APR - ${apr.taskName}`, content));
    win.document.close();
  }
};

export const printInspection = (inspection: Inspection) => {
  const statusLabel = inspection.hasImminentRisk ? 'RISCO CRÍTICO' : 'CONFORME';
  
  const rows = inspection.items.map((item, i) => {
    let statusBadge = '';
    if (item.status === 'C') statusBadge = '<span class="status-badge status-c">CONFORME</span>';
    else if (item.status === 'NC') statusBadge = '<span class="status-badge status-nc">NÃO CONFORME</span>';
    else statusBadge = '<span class="status-badge status-na">N/A</span>';

    return `
    <tr>
      <td width="5%" style="text-align:center;">${i + 1}</td>
      <td width="65%">
        <div style="font-weight:600; font-size: 11px;">${item.question}</div>
        ${item.comment ? `<div class="comment-text"><strong>Obs:</strong> ${item.comment}</div>` : ''}
        ${item.photoUrl ? `
          <div class="evidence-box">
             <div style="font-size:7px; color:#999; margin-bottom:2px;">EVIDÊNCIA FOTOGRÁFICA</div>
             <img src="${item.photoUrl}" class="evidence-img" />
          </div>
        ` : ''}
      </td>
      <td width="30%">
        ${statusBadge}
        ${item.severity ? `<div style="font-size:9px; color:#b91c1c; margin-top:4px; font-weight:bold;">GRAVIDADE: ${item.severity.toUpperCase()}</div>` : ''}
      </td>
    </tr>
  `}).join('');

  const inspectorSignatureHtml = inspection.signatureUrl 
    ? `<img src="${inspection.signatureUrl}" class="sig-img" />`
    : `<br/><br/>`;

  const content = `
    <div class="section-title">Resumo da Inspeção</div>
    <div class="grid">
      <div class="field"><span class="label">Local / Obra</span><span class="value">${inspection.location}</span></div>
      <div class="field"><span class="label">Data / Hora</span><span class="value">${inspection.date}</span></div>
      <div class="field"><span class="label">Inspetor Responsável</span><span class="value">${inspection.inspectorName}</span></div>
      <div class="field"><span class="label">Parecer Geral</span><span class="value" style="font-weight:bold; color:${inspection.hasImminentRisk ? 'red' : 'green'}">${statusLabel}</span></div>
    </div>

    <div class="section-title">Checklist Detalhado</div>
    <table>
      <thead>
        <tr>
          <th style="text-align:center;">#</th>
          <th>Item Verificado & Evidências</th>
          <th>Status & Avaliação</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="section-title">Termo de Encerramento</div>
    <div style="padding: 10px; border: 1px solid #ddd; background-color: #fafafa; font-style: italic; font-size: 10px;">
      A inspeção foi realizada in-loco. As não conformidades identificadas (se houver) foram registradas com evidências e devem ser tratadas conforme o plano de ação da obra. O inspetor atesta a veracidade das informações.
    </div>
    
    <div class="signatures">
      <div class="sig-box">
        ${inspectorSignatureHtml}
        <span class="sig-name">${inspection.inspectorName}</span>
        <span class="sig-role">Técnico de Segurança (TST)</span>
      </div>
      <div class="sig-box">
        <br/><br/><br/>
        <span class="sig-name">__________________________</span>
        <span class="sig-role">Gestor da Obra / Responsável</span>
      </div>
    </div>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(getBaseLayout(`Relatório de Inspeção`, content));
    win.document.close();
  }
};
