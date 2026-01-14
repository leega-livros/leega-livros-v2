let DADOS = [];        // linhas de colunas
let TABELAS = [];      // metadados por tabela (novo)
let activeTab = "colunas";

const $ = (sel) => document.querySelector(sel);

function badgeBool(v) {
  return v ? "Sim" : "—";
}

function normalize(str) {
  return (str ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function buildTabelaOptions(rows) {
  const unique = Array.from(new Set(rows.map(r => r.tabela).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  $("#fTabela").innerHTML =
    `<option value="">Todas</option>` +
    unique.map(t => `<option value="${t}">${t}</option>`).join("");
}

/* -----------------------------
   Render: aba Colunas (existente)
-------------------------------- */
function renderRows(rows) {
  $("#count").textContent = `${rows.length} linha(s)`;

  $("#tbody").innerHTML = rows.map(r => `
    <tr class="border-b border-slate-200 hover:bg-slate-50">
      <td class="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">${r.tabela || "—"}</td>
      <td class="px-3 py-2 font-mono text-sm text-slate-800 whitespace-nowrap">${r.coluna || "—"}</td>
      <td class="px-3 py-2 text-slate-800 whitespace-nowrap">${r.tipo || "—"}</td>
      <td class="px-3 py-2 text-slate-700 whitespace-nowrap">${r.tamanho || "—"}</td>
      <td class="px-3 py-2 text-center">${badgeBool(r.pk)}</td>
      <td class="px-3 py-2 text-center">${badgeBool(r.fk)}</td>
      <td class="px-3 py-2 text-slate-700">${r.descricao || "—"}</td>
      <td class="px-3 py-2 text-slate-700">${r.exemplo || "—"}</td>
    </tr>
  `).join("");
}

/* -----------------------------
   Render: aba Tabelas (nova)
-------------------------------- */
function findTabelaMeta(nome) {
  if (!nome) return null;
  const n = normalize(nome);
  return TABELAS.find(t => normalize(t.tabela) === n) || null;
}

function renderTabelaCard(t) {
  const desc = t.descricao_funcional || "—";
  const uso  = t.uso_em_relatorios || "—";
  const obs  = t.observacoes || "—";

  return `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="font-semibold text-slate-900">${t.tabela}</div>
        <span class="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600">Tabela</span>
      </div>
      <div class="mt-2 text-sm text-slate-700">${desc}</div>
      <div class="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div><span class="text-xs font-semibold text-slate-700">Uso em relatórios:</span> <span class="text-slate-700">${uso}</span></div>
        <div><span class="text-xs font-semibold text-slate-700">Observações:</span> <span class="text-slate-700">${obs}</span></div>
      </div>
    </div>
  `;
}

function renderTabelasList(list) {
  $("#tabelasList").innerHTML = list.map(renderTabelaCard).join("");
}

function renderTabelaMeta(meta) {
  // Quando o usuário escolhe uma tabela no select, mostramos um painel focado nela.
  if (!meta) {
    $("#tabelaMeta").classList.add("hidden");
    return;
  }

  $("#metaNome").textContent = meta.tabela || "";
  $("#metaDesc").textContent = meta.descricao_funcional || "—";
  $("#metaUso").textContent  = meta.uso_em_relatorios || "—";
  $("#metaObs").textContent  = meta.observacoes || "—";
  $("#metaPerg").textContent = meta.exemplos_perguntas || "—";

  $("#tabelaMeta").classList.remove("hidden");
}

/* -----------------------------
   Filtros (compartilhados)
-------------------------------- */
function applyFiltersColunas() {
  const q = normalize($("#q").value);
  const t = $("#fTabela").value;
  const onlyPK = $("#onlyPK").checked;
  const onlyFK = $("#onlyFK").checked;

  const rows = DADOS.filter(r => {
    if (t && r.tabela !== t) return false;
    if (onlyPK && !r.pk) return false;
    if (onlyFK && !r.fk) return false;

    if (!q) return true;

    const hay = normalize([r.tabela, r.coluna, r.tipo, r.tamanho, r.descricao, r.exemplo].join(" | "));
    return hay.includes(q);
  });

  renderRows(rows);
}

function applyFiltersTabelas() {
  const q = normalize($("#q").value);
  const t = $("#fTabela").value;

  // Se há tabela selecionada, mostramos o painel focado nela (e escondemos a lista).
  if (t) {
    const meta = findTabelaMeta(t) || { tabela: t };
    renderTabelaMeta(meta);
    $("#tabelasList").classList.add("hidden");
    return;
  }

  // Caso contrário, mostramos a lista completa (filtrável por busca).
  $("#tabelaMeta").classList.add("hidden");
  $("#tabelasList").classList.remove("hidden");

  let list = TABELAS;

  if (q) {
    list = TABELAS.filter(x => {
      const hay = normalize([
        x.tabela,
        x.descricao_funcional,
        x.uso_em_relatorios,
        x.observacoes,
        x.exemplos_perguntas
      ].join(" | "));
      return hay.includes(q);
    });
  }

  renderTabelasList(list);
}

function applyFilters() {
  if (activeTab === "tabelas") applyFiltersTabelas();
  else applyFiltersColunas();
}

/* -----------------------------
   Abas
-------------------------------- */
function setActiveTab(tab) {
  activeTab = tab;

  const isCol = tab === "colunas";
  
  // 🔹 Ajusta o texto de exemplo da busca conforme a aba
const inputBusca = document.querySelector("#q");

if (isCol) {
  inputBusca.placeholder = "Ex: ID_Usuario, reserva, varchar, multa...";
} else {
  inputBusca.placeholder = "Ex: reserva, empréstimo, estoque, uso em relatórios...";
}


  // Botões
  $("#tabColunas").className = isCol
    ? "px-3 py-2 rounded-xl border border-slate-300 bg-slate-900 text-white text-sm"
    : "px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-800";

  $("#tabTabelas").className = !isCol
    ? "px-3 py-2 rounded-xl border border-slate-300 bg-slate-900 text-white text-sm"
    : "px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-800";

  // Visões
  $("#viewColunas").classList.toggle("hidden", !isCol);
  $("#viewTabelas").classList.toggle("hidden", isCol);

  // Filtros avançados (PK/FK) só fazem sentido na aba de colunas
  $("#filtersAdvanced").classList.toggle("hidden", !isCol);

  applyFilters();
}

/* -----------------------------
   Helpers: carregar JSON
-------------------------------- */
async function fetchJsonSafe(path) {
  try {
    const r = await fetch(path);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function mergeTabelas(baseList, extraList) {
  // extraList sobrescreve baseList por nome de tabela
  const map = new Map();
  (Array.isArray(baseList) ? baseList : []).forEach(t => {
    if (t && t.tabela) map.set(normalize(t.tabela), t);
  });
  (Array.isArray(extraList) ? extraList : []).forEach(t => {
    if (t && t.tabela) map.set(normalize(t.tabela), t);
  });
  return Array.from(map.values()).sort((a, b) => (a.tabela || "").localeCompare((b.tabela || ""), "pt-BR"));
}

/* -----------------------------
   Init / Load
-------------------------------- */
async function init() {
  try {
    // 1) Carrega dicionario.json (colunas)
    const json = await fetchJsonSafe("dicionario.json");
    if (!json) throw new Error("Falha ao carregar dicionario.json");

    // Compatibilidade:
    // - formato antigo: [ {tabela, coluna, ...}, ... ]
    // - formato novo: { colunas: [...], tabelas: [...] }
    let tabelasDentroDoDicionario = [];
    if (Array.isArray(json)) {
      DADOS = json;
    } else {
      DADOS = Array.isArray(json.colunas) ? json.colunas : [];
      tabelasDentroDoDicionario = Array.isArray(json.tabelas) ? json.tabelas : [];
    }

    // 2) Carrega tabelas.json separado (metadados de tabela)
    const tabelasSeparadas = await fetchJsonSafe("tabelas.json");

    // 3) Prioridade: se houver tabelas.json, ele complementa/sobrescreve.
    TABELAS = mergeTabelas(tabelasDentroDoDicionario, Array.isArray(tabelasSeparadas) ? tabelasSeparadas : []);

    // 4) Monta options do select com base nas COLUNAS (porque é a fonte confiável)
    buildTabelaOptions(DADOS);

    // 5) Fallback: se ainda não houver metadados, cria cards só com nomes
    if (!TABELAS.length) {
      const unique = Array.from(new Set(DADOS.map(r => r.tabela).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, "pt-BR"));
      TABELAS = unique.map(t => ({ tabela: t }));
    }

    // eventos filtros
    $("#q").addEventListener("input", applyFilters);
    $("#fTabela").addEventListener("change", applyFilters);
    $("#onlyPK").addEventListener("change", applyFilters);
    $("#onlyFK").addEventListener("change", applyFilters);

    // abas
    $("#tabColunas").addEventListener("click", () => setActiveTab("colunas"));
    $("#tabTabelas").addEventListener("click", () => setActiveTab("tabelas"));

    // reset
    $("#btnReset").addEventListener("click", () => {
      $("#q").value = "";
      $("#fTabela").value = "";
      $("#onlyPK").checked = false;
      $("#onlyFK").checked = false;
      applyFilters();
    });

    // inicializa na aba colunas
    setActiveTab("colunas");
  } catch (e) {
    console.error(e);
    $("#erro")?.classList?.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", init);
