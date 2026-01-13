let perguntas = [];

// ✅ Grupos / responsáveis
const GRUPOS = {
  joao:   { nome: "João",   ids: [1, 6, 10, 14, 17, 20, 24, 31, 35, 41, 51, 58] },
  marlon: { nome: "Marlon", ids: [2, 5, 11, 15, 18, 21, 25, 33, 36, 43, 52, 56] },
  sergio: { nome: "Sergio", ids: [3, 7, 9, 16, 19, 22, 28, 34, 39, 46, 53, 57] },
  israel: { nome: "Israel", ids: [4, 8, 12, 23, 26, 30, 38, 44, 48, 54, 55] },
  mozart: { nome: "Mozart", ids: [13, 27, 29, 32, 37, 40, 42, 45, 47, 49, 50] }
};

// ✅ Tipos principais (sem mexer no JSON)
const TIPOS_PRINCIPAIS = new Set(["ALTER", "UPDATE", "INSERT", "DELETE", "VIEW", "SELECT"]);

// Estado dos filtros
let filtroAtual = "todas";         // pessoa
let tiposSelecionados = new Set(); // multi
let tagsSelecionadas  = new Set(); // multi
let modoTags = "ANY";              // ANY (OR) | ALL (AND)

// =====================
// DOM
// =====================
const lista = document.getElementById("lista");
const busca = document.getElementById("busca");

// (podem não existir)
const btnMinhas = document.getElementById("btnMinhas");
const btnTodas  = document.getElementById("btnTodas");

// Dropdown Tipos
const btnTipos     = document.getElementById("btnTipos");
const menuTipos    = document.getElementById("menuTipos");
const limparTiposBtn = document.getElementById("limparTipos");
const listaTipos   = document.getElementById("listaTipos");
const resumoTipos  = document.getElementById("resumoTipos");

// Dropdown Tags
const btnTags      = document.getElementById("btnTags");
const menuTags     = document.getElementById("menuTags");
const limparTagsBtn  = document.getElementById("limparTags");
const listaTags    = document.getElementById("listaTags");
const resumoTags   = document.getElementById("resumoTags");

// Modo tags
const modoAnyBtn   = document.getElementById("modoAny");
const modoAllBtn   = document.getElementById("modoAll");

// =====================
// Barra de pessoas (gerada via JS abaixo da busca)
// =====================
const filtroBar = document.createElement("div");
filtroBar.id = "filtrosPessoas";
filtroBar.className = "flex flex-wrap gap-2 mb-3";

const controlsContainer = busca?.parentElement;
if (controlsContainer) {
  controlsContainer.insertAdjacentElement("afterend", filtroBar);
}

// =====================
// Helpers
// =====================
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ✅ Persistência simples (1 query salva por questão)
function getQuerySalva(numero) {
  return localStorage.getItem("q_" + numero);
}
function setQuerySalva(numero, query) {
  localStorage.setItem("q_" + numero, query);
}
function getQueryAtual(p) {
  return getQuerySalva(p.numero) ?? (p.query_base || "");
}

/* ========= Ocultar/Mostrar Query (modo treino) ========= */
function isOculto(n) {
  return localStorage.getItem("hide_" + n) === "1";
}
function setOculto(n, value) {
  localStorage.setItem("hide_" + n, value ? "1" : "0");
}
function toggleMostrar(n) {
  const view = document.getElementById("view" + n);
  const edit = document.getElementById("edit" + n);
  const btn = document.getElementById("btnShow" + n);

  const oculto = isOculto(n);
  const novoOculto = !oculto;
  setOculto(n, novoOculto);

  // Se estiver editando, sai de edição antes
  if (edit && !edit.classList.contains("hidden")) {
    toggleEdit(n);
  }

  if (novoOculto) {
    view.classList.add("hidden");
    btn.textContent = "Mostrar query";
  } else {
    view.classList.remove("hidden");
    btn.textContent = "Ocultar query";
    if (window.Prism) Prism.highlightAll();
  }
}
/* ====================================================== */

// =====================
// Base por pessoa
// =====================
function getBasePorPessoa() {
  if (filtroAtual === "todas") return perguntas;

  const grupo = GRUPOS[filtroAtual];
  if (!grupo) return perguntas;

  const setIds = new Set(grupo.ids);
  return perguntas.filter(p => setIds.has(Number(p.numero)));
}

// =====================
// Separação runtime: tipos principais e tags
// =====================
function getTiposPrincipaisDoItem(p) {
  const arr = Array.isArray(p.tipos) ? p.tipos : [];
  return arr.map(t => String(t).toUpperCase()).filter(t => TIPOS_PRINCIPAIS.has(t));
}
function getTagsDoItem(p) {
  const arr = Array.isArray(p.tipos) ? p.tipos : [];
  return arr.map(t => String(t).toUpperCase()).filter(t => !TIPOS_PRINCIPAIS.has(t));
}

// =====================
// Facets (disponíveis + contagem) a partir do subconjunto atual (por pessoa)
// =====================
function buildFacetCounts(base) {
  const tipoCount = new Map();
  const tagCount  = new Map();

  base.forEach(p => {
    new Set(getTiposPrincipaisDoItem(p)).forEach(t => tipoCount.set(t, (tipoCount.get(t) || 0) + 1));
    new Set(getTagsDoItem(p)).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1));
  });

  const ordem = ["SELECT","INSERT","UPDATE","DELETE","ALTER","VIEW"];
  const tipos = Array.from(tipoCount.keys()).sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
  const tags  = Array.from(tagCount.keys()).sort();

  return { tipos, tags, tipoCount, tagCount };
}

// =====================
// Dropdown UI helpers
// =====================
function setupDropdown(btn, menu) {
  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  menu.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    if (!menu.classList.contains("hidden")) menu.classList.add("hidden");
  });
}

function renderCheckboxList(containerEl, keys, countMap, selectedSet, onChange) {
  if (!containerEl) return;

  containerEl.innerHTML = keys.map(k => {
    const checked = selectedSet.has(k) ? "checked" : "";
    const count = countMap.get(k) || 0;
    return `
      <label class="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
        <span class="flex items-center gap-2">
          <input type="checkbox" data-key="${k}" ${checked}
            class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300">
          <span class="text-sm text-slate-800">${k}</span>
        </span>
        <span class="text-xs text-slate-500">${count}</span>
      </label>
    `;
  }).join("");

  containerEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => onChange(cb.dataset.key, cb.checked));
  });
}

function updateSummaries() {
  if (resumoTipos) resumoTipos.textContent = tiposSelecionados.size ? `Selecionados: ${Array.from(tiposSelecionados).join(", ")}` : "";
  if (resumoTags)  resumoTags.textContent  = tagsSelecionadas.size  ? `Selecionadas: ${Array.from(tagsSelecionadas).join(", ")}` : "";
}

function setModoTagsUI(modo) {
  modoTags = modo;

  if (modoAnyBtn && modoAllBtn) {
    if (modo === "ANY") {
      modoAnyBtn.className = "px-2 py-1 text-xs rounded-lg border bg-slate-900 text-white";
      modoAllBtn.className = "px-2 py-1 text-xs rounded-lg border bg-white";
    } else {
      modoAllBtn.className = "px-2 py-1 text-xs rounded-lg border bg-slate-900 text-white";
      modoAnyBtn.className = "px-2 py-1 text-xs rounded-lg border bg-white";
    }
  }
}

// Recalcula lista/contagens no dropdown com base na pessoa atual
function rebuildDropdowns() {
  const basePessoa = getBasePorPessoa();
  const { tipos, tags, tipoCount, tagCount } = buildFacetCounts(basePessoa);

  // remove seleções que não existem mais no subset (troca de pessoa)
  tiposSelecionados = new Set(Array.from(tiposSelecionados).filter(t => tipos.includes(t)));
  tagsSelecionadas  = new Set(Array.from(tagsSelecionadas).filter(t => tags.includes(t)));

  renderCheckboxList(listaTipos, tipos, tipoCount, tiposSelecionados, (k, checked) => {
    checked ? tiposSelecionados.add(k) : tiposSelecionados.delete(k);
    updateSummaries();
    render(aplicarFiltros());
  });

  renderCheckboxList(listaTags, tags, tagCount, tagsSelecionadas, (k, checked) => {
    checked ? tagsSelecionadas.add(k) : tagsSelecionadas.delete(k);
    updateSummaries();
    render(aplicarFiltros());
  });

  updateSummaries();
}

// =====================
// Filtro cumulativo: pessoa + tipos + tags + busca
// =====================
function aplicarFiltros() {
  let base = getBasePorPessoa();

  // TIPOS (OR)
  if (tiposSelecionados.size > 0) {
    base = base.filter(p => {
      const ts = new Set(getTiposPrincipaisDoItem(p));
      for (const t of tiposSelecionados) if (ts.has(t)) return true;
      return false;
    });
  }

  // TAGS (ANY/ALL)
  if (tagsSelecionadas.size > 0) {
    base = base.filter(p => {
      const tg = new Set(getTagsDoItem(p));
      if (modoTags === "ALL") {
        for (const t of tagsSelecionadas) if (!tg.has(t)) return false;
        return true;
      } else {
        for (const t of tagsSelecionadas) if (tg.has(t)) return true;
        return false;
      }
    });
  }

  // BUSCA
  const q = (busca?.value || "").trim().toLowerCase();
  if (!q) return base;

  if (/^\d+$/.test(q)) {
    const num = Number(q);
    return base.filter(p => Number(p.numero) === num);
  }

  const nums = (q.match(/\d+/g) || []).map(Number);

  return base.filter(p => {
    const texto = (p.pergunta || "").toLowerCase();
    const termos = q.split(/\s+/).filter(Boolean);
    const bateTexto = texto.includes(q) || termos.some(t => texto.includes(t));
    const bateNumero = nums.length ? nums.includes(Number(p.numero)) : true;
    return bateNumero && bateTexto;
  });
}

// =====================
// Pessoas (botões)
// =====================
function renderFiltrosPessoas() {
  const keys = Object.keys(GRUPOS);

  filtroBar.innerHTML = `
    <button type="button"
      class="px-3 py-2 rounded-lg border text-sm ${
        filtroAtual === "todas"
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
      }"
      onclick="setFiltro('todas')">
      Todas
    </button>
    ${keys.map(k => `
      <button type="button"
        class="px-3 py-2 rounded-lg border text-sm ${
          filtroAtual === k
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
        }"
        onclick="setFiltro('${k}')">
        👤 ${GRUPOS[k].nome} (${GRUPOS[k].ids.length})
      </button>
    `).join("")}
  `;
}

function setFiltro(key) {
  filtroAtual = key;
  if (busca) busca.value = "";

  renderFiltrosPessoas();
  rebuildDropdowns();          // ✅ atualiza tipos/tags disponíveis conforme pessoa
  render(aplicarFiltros());
}

// =====================
// Ações do dropdown (limpar / modo)
// =====================
limparTiposBtn?.addEventListener("click", () => {
  tiposSelecionados.clear();
  rebuildDropdowns();
  render(aplicarFiltros());
});

limparTagsBtn?.addEventListener("click", () => {
  tagsSelecionadas.clear();
  rebuildDropdowns();
  render(aplicarFiltros());
});

modoAnyBtn?.addEventListener("click", () => {
  setModoTagsUI("ANY");
  render(aplicarFiltros());
});

modoAllBtn?.addEventListener("click", () => {
  setModoTagsUI("ALL");
  render(aplicarFiltros());
});

// 🔎 Busca respeitando todos os filtros
busca?.addEventListener("input", () => render(aplicarFiltros()));

// ⭐ Botão: Minhas queries (Israel)
btnMinhas?.addEventListener("click", () => setFiltro("israel"));

// 🔄 Botão: Todas
btnTodas?.addEventListener("click", () => setFiltro("todas"));

// =====================
// Render da lista (mantido)
// =====================
function render(items) {
  lista.innerHTML = "";

  if (!items.length) {
    lista.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 class="text-lg font-semibold mb-1">Nenhuma questão encontrada</h2>
        <p class="text-slate-600 text-sm">Tente mudar os filtros (pessoa, tipos, tags) ou buscar por outro número.</p>
      </div>
    `;
    return;
  }

  const sorted = items.slice().sort((a, b) => Number(a.numero) - Number(b.numero));

  sorted.forEach(p => {
    const queryAtual = getQueryAtual(p);

    // ✅ Badge do responsável (sempre)
    const numero = Number(p.numero);
    const keyGrupo = Object.keys(GRUPOS).find(k => GRUPOS[k].ids.includes(numero));
    const badgeClasses = (keyGrupo && filtroAtual !== "todas" && filtroAtual === keyGrupo)
      ? "bg-slate-900 text-white border-slate-900"
      : "bg-slate-100 text-slate-700 border-slate-200";

    const badgeGrupo = keyGrupo
      ? `<span class="text-xs px-2 py-1 rounded-full border ${badgeClasses}">${GRUPOS[keyGrupo].nome}</span>`
      : "";

    // ✅ Badges (tipo principal + tags)
    const tiposMain = getTiposPrincipaisDoItem(p);
    const tags = getTagsDoItem(p);

    const badgeTipo = tiposMain.length
      ? tiposMain.map(t => `<span class="text-xs px-2 py-1 rounded-full border bg-white text-slate-800 border-slate-200">${t}</span>`).join("")
      : "";

    const badgeTags = tags.length
      ? tags.map(t => `<span class="text-xs px-2 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200">${t}</span>`).join("")
      : "";

    lista.innerHTML += `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-semibold mb-1">Questão ${p.numero}</h2>
              ${badgeGrupo}
              ${badgeTipo}
              ${badgeTags}
            </div>
            <p class="text-slate-700 mb-3">${escapeHtml(p.pergunta)}</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              onclick="toggleEdit(${p.numero})"
              class="text-sm text-blue-600 hover:underline whitespace-nowrap">
              Editar
            </button>

            <button
              type="button"
              id="btnShow${p.numero}"
              onclick="toggleMostrar(${p.numero})"
              class="text-sm text-slate-600 hover:underline whitespace-nowrap">
              ${isOculto(p.numero) ? "Mostrar query" : "Ocultar query"}
            </button>
          </div>
        </div>

        <!-- VISUAL (Prism) -->
        <pre id="view${p.numero}" class="border border-slate-200 rounded-xl p-4 overflow-auto bg-white">
<code class="language-sql" id="code${p.numero}">${escapeHtml(queryAtual)}</code>
        </pre>

        <!-- EDIT -->
        <textarea id="edit${p.numero}"
          class="hidden w-full min-h-[160px] bg-white border border-slate-300 rounded-xl p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
          spellcheck="false">${escapeHtml(queryAtual)}</textarea>

        <div class="flex flex-wrap gap-2 mt-3">
          <button type="button" onclick="copiar(${p.numero})"
            class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Copiar
          </button>
        </div>

        <p class="text-xs text-slate-500 mt-3">
          Salva automaticamente ao sair da edição
        </p>
      </div>
    `;
  });

  // aplica ocultar/mostrar conforme estado salvo
  sorted.forEach(p => {
    const n = p.numero;
    const oculto = isOculto(n);
    const view = document.getElementById("view" + n);
    const btn = document.getElementById("btnShow" + n);
    if (oculto && view && btn) {
      view.classList.add("hidden");
      btn.textContent = "Mostrar query";
    }
  });

  if (window.Prism) Prism.highlightAll();
}

function toggleEdit(n) {
  const view = document.getElementById("view" + n);
  const edit = document.getElementById("edit" + n);
  const btnShow = document.getElementById("btnShow" + n);
  const code = document.getElementById("code" + n);

  // se estiver oculto, mostra antes de editar
  if (isOculto(n)) {
    setOculto(n, false);
    view.classList.remove("hidden");
    if (btnShow) btnShow.textContent = "Ocultar query";
  }

  const isEditing = !edit.classList.contains("hidden");

  // entrar em edição
  if (!isEditing) {
    edit.classList.remove("hidden");
    view.classList.add("hidden");
    edit.focus();
    return;
  }

  // sair da edição -> salvar
  const nova = edit.value;
  const atualSalva = getQuerySalva(n);
  if (atualSalva !== nova) setQuerySalva(n, nova);

  code.textContent = nova;

  view.classList.remove("hidden");
  edit.classList.add("hidden");

  if (window.Prism) Prism.highlightAll();
}

function copiar(n) {
  const edit = document.getElementById("edit" + n);
  const isEditing = edit && !edit.classList.contains("hidden");

  const text = isEditing
    ? edit.value
    : document.getElementById("code" + n).textContent;

  navigator.clipboard.writeText(text).then(() => {
    const btns = document.querySelectorAll(`button[onclick="copiar(${n})"]`);
    btns.forEach(btn => {
      const original = btn.textContent;
      btn.textContent = "Copiado ✓";
      btn.classList.add("bg-emerald-700");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("bg-emerald-700");
      }, 900);
    });
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}

// Expor globais usados nos onclick
window.setFiltro = setFiltro;
window.toggleEdit = toggleEdit;
window.toggleMostrar = toggleMostrar;
window.copiar = copiar;

// =====================
// Boot
// =====================
setupDropdown(btnTipos, menuTipos);
setupDropdown(btnTags, menuTags);
setModoTagsUI("ANY");

fetch("perguntas.json")
  .then(r => r.json())
  .then(data => {
    perguntas = data;

    renderFiltrosPessoas();
    rebuildDropdowns();
    render(aplicarFiltros());
  })
  .catch(() => {
    lista.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 class="text-lg font-semibold mb-1">Não foi possível carregar perguntas.json</h2>
        <p class="text-slate-600 text-sm">
          Verifique se o arquivo está na mesma pasta do index.html e se você está abrindo via servidor
          (ex.: Live Server). Alguns navegadores bloqueiam fetch via file://
        </p>
      </div>
    `;
  });
