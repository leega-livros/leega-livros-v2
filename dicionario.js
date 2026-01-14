let DADOS = [];
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
  const tables = Array.from(new Set(rows.map(r => r.tabela).filter(Boolean)))
    .sort((a,b) => a.localeCompare(b, "pt-BR"));

  $("#fTabela").innerHTML =
    `<option value="">Todas as tabelas</option>` +
    tables.map(t => `<option value="${t}">${t}</option>`).join("");
}

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

function applyFilters() {
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

async function init() {
  try {
    const res = await fetch("dicionario.json");
    DADOS = await res.json();

    buildTabelaOptions(DADOS);
    applyFilters();

    $("#q").addEventListener("input", applyFilters);
    $("#fTabela").addEventListener("change", applyFilters);
    $("#onlyPK").addEventListener("change", applyFilters);
    $("#onlyFK").addEventListener("change", applyFilters);

    $("#btnReset").addEventListener("click", () => {
      $("#q").value = "";
      $("#fTabela").value = "";
      $("#onlyPK").checked = false;
      $("#onlyFK").checked = false;
      applyFilters();
    });
  } catch (e) {
    console.error(e);
    $("#erro").classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", init);
