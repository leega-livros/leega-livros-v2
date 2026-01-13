// sql-page.js
// Renderiza uma página simples para exibir um arquivo .sql (DDL/DML) com Prism + Copiar + Editar + Reset.

(function () {
  const container = document.getElementById("sqlContainer");

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getSalvo(key) {
    return localStorage.getItem(key);
  }

  function setSalvo(key, val) {
    localStorage.setItem(key, val);
  }

  function removeSalvo(key) {
    localStorage.removeItem(key);
  }

  function setLoading(msg = "Carregando script SQL…") {
    if (!container) return;
    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <div class="text-slate-800 font-semibold mb-1">${msg}</div>
        <div class="text-slate-600 text-sm">Se não carregar, verifique o Console (F12) e o caminho do arquivo.</div>
      </div>
    `;
  }

  function setError(title, details) {
    if (!container) return;
    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 class="text-lg font-semibold mb-1">${escapeHtml(title)}</h2>
        <p class="text-slate-600 text-sm whitespace-pre-wrap">${escapeHtml(details)}</p>
        <div class="mt-3 text-slate-500 text-xs">
          Dica: estes arquivos .sql são carregados via <code>fetch()</code>, então você precisa abrir via servidor
          (ex.: Live Server / hospedagem). Abrir via <code>file://</code> pode bloquear.
        </div>
      </div>
    `;
  }

  function renderPage(sqlTextOriginal) {
    const cfg = window.SQL_PAGE || {};
    const title = cfg.title || "SQL";
    const storageKey = cfg.storageKey || "sql_page";
    const language = cfg.language || "sql";

    const salvo = getSalvo(storageKey);
    const atual = salvo ?? sqlTextOriginal;

    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-5">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold">${escapeHtml(title)}</h2>
            <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Script único
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button type="button"
              id="btnEditSqlPage"
              class="text-sm text-blue-600 hover:underline whitespace-nowrap">
              Editar
            </button>

            <button type="button"
              id="btnResetSqlPage"
              class="text-sm text-slate-600 hover:underline whitespace-nowrap">
              Reset
            </button>
          </div>
        </div>

        <!-- VISUAL -->
        <pre id="viewSqlPage" class="border border-slate-200 rounded-xl p-4 overflow-auto bg-white">
<code class="language-${escapeHtml(language)}" id="codeSqlPage">${escapeHtml(atual)}</code>
        </pre>

        <!-- EDIT -->
        <textarea id="editSqlPage"
          class="hidden w-full min-h-[260px] bg-white border border-slate-300 rounded-xl p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
          spellcheck="false">${escapeHtml(atual)}</textarea>

        <div class="flex flex-wrap gap-2 mt-3">
          <button type="button" id="btnCopySqlPage"
            class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Copiar
          </button>
        </div>

        <p class="text-xs text-slate-500 mt-3">Salva automaticamente ao sair da edição</p>
      </div>
    `;

    // Prism
    if (window.Prism) Prism.highlightAll();

    // Eventos
    const btnEdit = document.getElementById("btnEditSqlPage");
    const btnReset = document.getElementById("btnResetSqlPage");
    const btnCopy = document.getElementById("btnCopySqlPage");

    const view = document.getElementById("viewSqlPage");
    const edit = document.getElementById("editSqlPage");
    const code = document.getElementById("codeSqlPage");

    btnEdit.addEventListener("click", () => {
      const isEditing = !edit.classList.contains("hidden");

      // Entrar em edição
      if (!isEditing) {
        edit.classList.remove("hidden");
        view.classList.add("hidden");
        btnEdit.textContent = "Salvar";
        edit.focus();
        return;
      }

      // Sair da edição -> salvar
      const nova = edit.value;
      setSalvo(storageKey, nova);

      code.textContent = nova;
      view.classList.remove("hidden");
      edit.classList.add("hidden");
      btnEdit.textContent = "Editar";

      if (window.Prism) Prism.highlightAll();
    });

    btnReset.addEventListener("click", () => {
      removeSalvo(storageKey);
      // volta ao original do arquivo
      code.textContent = sqlTextOriginal;
      edit.value = sqlTextOriginal;

      // garante modo visual
      view.classList.remove("hidden");
      edit.classList.add("hidden");
      btnEdit.textContent = "Editar";

      if (window.Prism) Prism.highlightAll();
    });

    btnCopy.addEventListener("click", async () => {
      const isEditing = !edit.classList.contains("hidden");
      const text = isEditing ? edit.value : code.textContent;

      try {
        await navigator.clipboard.writeText(text);
        const original = btnCopy.textContent;
        btnCopy.textContent = "Copiado ✓";
        btnCopy.classList.add("bg-emerald-700");
        setTimeout(() => {
          btnCopy.textContent = original;
          btnCopy.classList.remove("bg-emerald-700");
        }, 900);
      } catch {
        // fallback antigo
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    });
  }

  async function init() {
    if (!container) return;

    const cfg = window.SQL_PAGE || {};
    if (!cfg.fetchUrl) {
      setError("Configuração ausente", "Defina window.SQL_PAGE.fetchUrl no HTML (ex.: script_create.sql).");
      return;
    }

    setLoading();

    try {
      const res = await fetch(cfg.fetchUrl, { cache: "no-store" });
      if (!res.ok) {
        setError(
          "Não foi possível carregar o arquivo SQL",
          `Arquivo: ${cfg.fetchUrl}\nStatus: ${res.status} ${res.statusText}\n\nVerifique se o arquivo existe na mesma pasta e se você está abrindo via servidor.`
        );
        return;
      }

      const txt = await res.text();

      // se vier vazio, também avisa
      if (!txt || !txt.trim()) {
        setError(
          "Arquivo SQL vazio",
          `O arquivo ${cfg.fetchUrl} foi carregado, mas está vazio (ou só tem espaços).`
        );
        return;
      }

      renderPage(txt);
    } catch (err) {
      setError(
        "Erro ao buscar o arquivo SQL",
        `Arquivo: ${cfg.fetchUrl}\nErro: ${err?.message || err}\n\nDica: abra via Live Server (http://localhost) — file:// pode bloquear fetch().`
      );
    }
  }

  // roda quando o script carregar
  init();
})();
