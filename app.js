let perguntas = [];

// ✅ Grupos / responsáveis
const GRUPOS = {
  joao:   { nome: "João",   ids: [1, 6, 10, 14, 17, 20, 24, 31, 35, 41, 51, 58] },
  marlom: { nome: "Marlom", ids: [2, 5, 11, 15, 18, 21, 25, 33, 36, 43, 52, 56] },
  sergio: { nome: "Sergio", ids: [3, 7, 9, 16, 19, 22, 28, 34, 39, 46, 53, 57] },
  israel: { nome: "Israel", ids: [4, 8, 12, 23, 26, 30, 38, 44, 48, 54, 55] },
  mozart: { nome: "Mozart", ids: [13, 27, 29, 32, 37, 40, 42, 45, 47, 49, 50] }
};

// ✅ Estado do filtro
let filtroAtual = 'todas'; // 'todas' | 'joao' | 'marlom' | 'sergio' | 'israel' | 'mozart'

const lista = document.getElementById('lista');
const busca = document.getElementById('busca');

// Botões já existentes no HTML (Minhas/Todas)
const btnMinhas = document.getElementById('btnMinhas');
const btnTodas  = document.getElementById('btnTodas');

// ====== NOVO: barra de filtros por pessoa (gerada via JS) ======
const filtroBar = document.createElement('div');
filtroBar.id = 'filtrosPessoas';
filtroBar.className = 'flex flex-wrap gap-2 mb-4';

const controlsContainer = busca?.parentElement; // no seu HTML, input e botões estão dentro desse container
if (controlsContainer) {
  // insere logo abaixo do bloco de busca/botões
  controlsContainer.insertAdjacentElement('afterend', filtroBar);
}

function renderFiltrosPessoas() {
  const keys = Object.keys(GRUPOS);
  filtroBar.innerHTML = `
    <button type="button"
      id="btnFiltro_todas"
      class="px-3 py-2 rounded-lg border text-sm ${filtroAtual === 'todas' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'}"
      onclick="setFiltro('todas')">
      Todas
    </button>
    ${keys.map(k => `
      <button type="button"
        id="btnFiltro_${k}"
        class="px-3 py-2 rounded-lg border text-sm ${filtroAtual === k ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'}"
        onclick="setFiltro('${k}')">
        👤 ${GRUPOS[k].nome} (${GRUPOS[k].ids.length})
      </button>
    `).join('')}
  `;
}

function setFiltro(key) {
  filtroAtual = key;
  busca.value = '';
  renderFiltrosPessoas();
  render(getBaseFiltrada());
}
// ===============================================================

fetch('perguntas.json')
  .then(r => r.json())
  .then(data => {
    perguntas = data;
    renderFiltrosPessoas();
    render(getBaseFiltrada());
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

// 🔎 Busca respeitando o filtro atual (número OU texto OU "número + texto")
busca.addEventListener('input', () => {
  const q = busca.value.trim().toLowerCase();
  const base = getBaseFiltrada();

  if (!q) return render(base);

  // Se for número puro -> filtra por número exato
  if (/^\d+$/.test(q)) {
    const num = Number(q);
    return render(base.filter(p => Number(p.numero) === num));
  }

  // Caso contrário -> filtra por texto no enunciado (e também aceita "número + texto")
  const nums = (q.match(/\d+/g) || []).map(Number);

  const filtradas = base.filter(p => {
    const texto = (p.pergunta || '').toLowerCase();
    const termos = q.split(/\s+/).filter(Boolean);

    const bateTexto = texto.includes(q) || termos.some(t => texto.includes(t));
    const bateNumero = nums.length ? nums.includes(Number(p.numero)) : true;

    return bateNumero && bateTexto;
  });

  render(filtradas);
});

// ⭐ Botão: Minhas queries (Israel)
btnMinhas?.addEventListener('click', () => {
  setFiltro('israel');
});

// 🔄 Botão: Todas
btnTodas?.addEventListener('click', () => {
  setFiltro('todas');
});

function getBaseFiltrada() {
  if (filtroAtual === 'todas') return perguntas;

  const grupo = GRUPOS[filtroAtual];
  if (!grupo) return perguntas;

  const setIds = new Set(grupo.ids);
  return perguntas.filter(p => setIds.has(Number(p.numero)));
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getVersoes(n) {
  return JSON.parse(localStorage.getItem('q_' + n) || '[]');
}

function setVersoes(n, versoes) {
  localStorage.setItem('q_' + n, JSON.stringify(versoes));
}

function getQueryAtual(p) {
  const versoes = getVersoes(p.numero);
  if (versoes.length) return versoes.at(-1).query;
  return p.query_base || "";
}

/* ========= Ocultar/Mostrar Query (modo treino) ========= */
function isOculto(n) {
  return localStorage.getItem('hide_' + n) === '1';
}

function setOculto(n, value) {
  localStorage.setItem('hide_' + n, value ? '1' : '0');
}

function toggleMostrar(n) {
  const view = document.getElementById('view' + n);
  const edit = document.getElementById('edit' + n);
  const btn = document.getElementById('btnShow' + n);

  const oculto = isOculto(n);
  const novoOculto = !oculto;
  setOculto(n, novoOculto);

  // Se estiver em modo edição, volta para visual antes de ocultar/mostrar
  if (edit && !edit.classList.contains('hidden')) {
    toggleEdit(n);
  }

  if (novoOculto) {
    view.classList.add('hidden');
    btn.textContent = 'Mostrar query';
  } else {
    view.classList.remove('hidden');
    btn.textContent = 'Ocultar query';
    if (window.Prism) Prism.highlightAll();
  }
}
/* ====================================================== */

function render(items) {
  lista.innerHTML = '';

  if (!items.length) {
    lista.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 class="text-lg font-semibold mb-1">Nenhuma questão encontrada</h2>
        <p class="text-slate-600 text-sm">Tente buscar por outro número (ex.: 4).</p>
      </div>
    `;
    return;
  }

  const sorted = items.slice().sort((a, b) => Number(a.numero) - Number(b.numero));

  sorted.forEach(p => {
    const versoes = getVersoes(p.numero);
    const queryAtual = getQueryAtual(p);

    // badges
    const badgeGrupo = filtroAtual !== 'todas' && GRUPOS[filtroAtual]
      ? `<span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">${GRUPOS[filtroAtual].nome}</span>`
      : '';

    const isIsrael = GRUPOS.israel.ids.includes(Number(p.numero));

    lista.innerHTML += `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-semibold mb-1">Questão ${p.numero}</h2>
              ${badgeGrupo}
              ${isIsrael ? `<span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">minha</span>` : ``}
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
              ${isOculto(p.numero) ? 'Mostrar query' : 'Ocultar query'}
            </button>
          </div>
        </div>

        <!-- VISUAL (com coloração Prism) -->
        <pre id="view${p.numero}" class="border border-slate-200 rounded-xl p-4 overflow-auto bg-white">
<code class="language-sql" id="code${p.numero}">${escapeHtml(queryAtual)}</code>
        </pre>

        <!-- EDIT (textarea clean) -->
        <textarea id="edit${p.numero}"
          class="hidden w-full min-h-[160px] bg-white border border-slate-300 rounded-xl p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
          spellcheck="false">${escapeHtml(queryAtual)}</textarea>

        <div class="flex flex-wrap gap-2 mt-3">
          <button type="button" onclick="salvar(${p.numero})"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Salvar versão
          </button>

          <button type="button" onclick="restaurar(${p.numero})"
            class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300">
            Restaurar última
          </button>

          <button type="button" onclick="copiar(${p.numero})"
            class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Copiar
          </button>
        </div>

        <p class="text-xs text-slate-500 mt-3">
          Versões salvas: ${versoes.length}
        </p>
      </div>
    `;
  });

  // Aplica ocultar/mostrar conforme estado salvo
  sorted.forEach(p => {
    const n = p.numero;
    const oculto = isOculto(n);
    const view = document.getElementById('view' + n);
    const btn = document.getElementById('btnShow' + n);

    if (oculto && view && btn) {
      view.classList.add('hidden');
      btn.textContent = 'Mostrar query';
    }
  });

  if (window.Prism) Prism.highlightAll();
}

function toggleEdit(n) {
  const view = document.getElementById('view' + n);
  const edit = document.getElementById('edit' + n);
  const btnShow = document.getElementById('btnShow' + n);

  // Se estiver oculto, mostra antes de editar
  if (isOculto(n)) {
    setOculto(n, false);
    view.classList.remove('hidden');
    if (btnShow) btnShow.textContent = 'Ocultar query';
  }

  const isEditing = !edit.classList.contains('hidden');

  if (!isEditing) {
    edit.classList.remove('hidden');
    view.classList.add('hidden');
    edit.focus();
    return;
  }

  view.classList.remove('hidden');
  edit.classList.add('hidden');

  const code = document.getElementById('code' + n);
  code.textContent = edit.value;

  if (window.Prism) Prism.highlightAll();
}

function salvar(n) {
  const edit = document.getElementById('edit' + n);
  const isEditing = edit && !edit.classList.contains('hidden');

  const query = isEditing
    ? edit.value
    : document.getElementById('code' + n).textContent;

  const versoes = getVersoes(n);
  versoes.push({
    data: new Date().toLocaleString(),
    query
  });
  setVersoes(n, versoes);

  if (edit) edit.value = query;
  const code = document.getElementById('code' + n);
  if (code) code.textContent = query;

  if (window.Prism) Prism.highlightAll();
}

function restaurar(n) {
  const versoes = getVersoes(n);
  if (!versoes.length) return;

  const ultima = versoes.at(-1).query;

  const edit = document.getElementById('edit' + n);
  const code = document.getElementById('code' + n);

  if (edit) edit.value = ultima;
  if (code) code.textContent = ultima;

  if (window.Prism) Prism.highlightAll();
}

function copiar(n) {
  const edit = document.getElementById('edit' + n);
  const isEditing = edit && !edit.classList.contains('hidden');

  const text = isEditing
    ? edit.value
    : document.getElementById('code' + n).textContent;

  navigator.clipboard.writeText(text).then(() => {
    const btns = document.querySelectorAll(`button[onclick="copiar(${n})"]`);
    btns.forEach(btn => {
      const original = btn.textContent;
      btn.textContent = 'Copiado ✓';
      btn.classList.add('bg-emerald-700');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('bg-emerald-700');
      }, 1000);
    });
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// 🔧 Expor setFiltro globalmente (usado nos onclick dos botões gerados)
window.setFiltro = setFiltro;
