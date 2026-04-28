<template>
  <div />
</template>

<script setup lang="ts">
const { client } = usePrismic();
const route = useRoute();
const nuxtApp = useNuxtApp();

type Mode = "page" | "all";

let popupRef: Window | null = null;

async function fetchData(mode: Mode) {
  const uid = route.params.uid as string | undefined;

  let data: unknown = null;
  let error: string | null = null;
  let docType = mode === "page" ? "page-data" : "page";

  try {
    if (mode === "page") {
      const payloadData = nuxtApp.payload.data ?? {};
      const staticData = (nuxtApp.payload as any).static ?? {};
      const collected: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(payloadData)) {
        collected[key] = value;
      }
      for (const [key, value] of Object.entries(staticData)) {
        if (!(key in collected)) collected[key] = value;
      }

      data = {
        route: route.path,
        keys: Object.keys(collected),
        data: collected,
      };

      if (Object.keys(collected).length === 0) {
        error =
          "No useAsyncData entries found for this route. Make sure data is fetched via useAsyncData() with a key.";
      }
    } else if (uid) {
      // ALL mode with UID — original behavior
      try {
        data = await client.getByUID("page", uid);
      } catch {
        const all = await client.get({ predicates: [] });
        data = all.results.find((r: any) => r.uid === uid) ?? all;
      }
    } else {
      // ALL mode, homepage — original behavior
      try {
        data = await client.getSingle("home");
        docType = "home";
      } catch {
        try {
          data = await client.getSingle("homepage");
          docType = "homepage";
        } catch {
          const all = await client.get({ predicates: [] });
          data = all;
          docType = "all";
        }
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return { data, error, docType };
}

async function openPrismicData(mode: Mode) {
  const uid = route.params.uid as string | undefined;
  const path = route.path;

  const { data, error, docType } = await fetchData(mode);

  const json = JSON.stringify(data, null, 2);
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prismic Data — ${path}</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: #1e1e1e;
      color: #d4d4d4;
      font-size: 13px;
      line-height: 1.5;
    }
    header {
      position: sticky; top: 0;
      background: #252526;
      padding: 12px 20px;
      border-bottom: 1px solid #333;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
      z-index: 10;
    }
    header h1 { margin: 0; font-size: 14px; font-weight: 600; color: #fff; }
    header .meta { color: #888; font-size: 12px; }
    header .meta strong { color: #4ec9b0; font-weight: 500; }
    .toolbar { margin-left: auto; display: flex; gap: 8px; align-items: center; }
    .mode-toggle {
      display: inline-flex;
      background: #1e1e1e;
      border: 1px solid #444;
      border-radius: 3px;
      overflow: hidden;
    }
    .mode-toggle button {
      background: transparent;
      color: #aaa;
      border: none;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      border-radius: 0;
    }
    .mode-toggle button.active { background: #0e639c; color: #fff; }
    .mode-toggle button:not(.active):hover { background: #2d2d30; color: #fff; }
    button {
      background: #0e639c; color: #fff; border: none;
      padding: 6px 12px; border-radius: 3px;
      font-size: 12px; cursor: pointer; font-family: inherit;
    }
    button:hover { background: #1177bb; }
    button.secondary { background: #3a3d41; }
    button.secondary:hover { background: #4a4d51; }
    .search {
      padding: 8px 20px; background: #252526;
      border-bottom: 1px solid #333;
      position: sticky; top: 53px; z-index: 9;
    }
    .search input {
      width: 100%; padding: 6px 10px;
      background: #3c3c3c; border: 1px solid #555;
      color: #d4d4d4; border-radius: 3px;
      font-family: inherit; font-size: 12px;
    }
    .search input:focus { outline: none; border-color: #007acc; }
    pre { margin: 0; padding: 20px; white-space: pre-wrap; word-break: break-word; tab-size: 2; }
    .err {
      background: #5a1d1d; color: #f48771;
      padding: 12px 20px; margin: 20px;
      border-left: 3px solid #f48771; border-radius: 3px;
    }
    .key { color: #9cdcfe; }
    .string { color: #ce9178; }
    .number { color: #b5cea8; }
    .boolean { color: #569cd6; }
    .null { color: #569cd6; }
    .highlight { background: #613a00; color: #fff; }
  </style>
</head>
<body>
  <header>
    <h1>Prismic Data</h1>
    <span class="meta">Route: <strong>${path}</strong></span>
    ${uid ? `<span class="meta">UID: <strong>${uid}</strong></span>` : ""}
    <span class="meta">Type: <strong id="doc-type">${docType}</strong></span>
    <div class="toolbar">
      <div class="mode-toggle" role="group" aria-label="Data mode">
        <button id="mode-page" class="${mode === "page" ? "active" : ""}" onclick="switchMode('page')">Page Data</button>
        <button id="mode-all" class="${mode === "all" ? "active" : ""}" onclick="switchMode('all')">All Data</button>
      </div>
      <button onclick="copyJson()">Copy JSON</button>
      <button class="secondary" onclick="requestRefresh()">Refresh</button>
    </div>
  </header>
  <div class="search">
    <input id="search" type="text" placeholder="Filter (Ctrl+F also works)…" />
  </div>
  <div id="content">
    ${error ? `<div class="err">${error.replace(/</g, "&lt;")}</div>` : ""}
    <pre id="json">${highlightJson(escaped)}</pre>
  </div>
  <script>
    let rawJson = ${JSON.stringify(json)};
    let currentMode = ${JSON.stringify(mode)};

    function copyJson() {
      navigator.clipboard.writeText(rawJson).then(() => {
        const btn = event.target;
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 1200);
      });
    }

    function escapeHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function highlightJson(escapedJson) {
      return escapedJson.replace(
        /(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?/g,
        (match, str, colon, bool) => {
          if (str) {
            return colon
              ? '<span class="key">' + str + '</span>' + colon
              : '<span class="string">' + str + '</span>';
          }
          if (bool) {
            return '<span class="' + (bool === 'null' ? 'null' : 'boolean') + '">' + bool + '</span>';
          }
          return '<span class="number">' + match + '</span>';
        },
      );
    }

    function setActiveMode(mode) {
      currentMode = mode;
      document.getElementById('mode-page').classList.toggle('active', mode === 'page');
      document.getElementById('mode-all').classList.toggle('active', mode === 'all');
    }

    function updateContent(payload) {
      rawJson = JSON.stringify(payload.data, null, 2);
      const escaped = escapeHtml(rawJson);
      const content = document.getElementById('content');
      content.innerHTML =
        (payload.error ? '<div class="err">' + escapeHtml(payload.error) + '</div>' : '') +
        '<pre id="json">' + highlightJson(escaped) + '</pre>';
      document.getElementById('doc-type').textContent = payload.docType;
      document.getElementById('search').value = '';
      attachSearch();
    }

    function switchMode(mode) {
      if (mode === currentMode) return;
      if (window.opener && !window.opener.closed) {
        setActiveMode(mode);
        window.opener.postMessage({ type: 'prismic-devtool-request', mode }, '*');
      } else {
        alert('Original tab was closed. Reopen the devtool with Option+D.');
      }
    }

    function requestRefresh() {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'prismic-devtool-request', mode: currentMode }, '*');
      }
    }

    window.addEventListener('message', (e) => {
      if (e.data?.type === 'prismic-devtool-response') {
        updateContent(e.data.payload);
      }
    });

    function attachSearch() {
      const search = document.getElementById('search');
      const pre = document.getElementById('json');
      const originalHtml = pre.innerHTML;
      search.oninput = (e) => {
        const term = e.target.value;
        if (!term) {
          pre.innerHTML = originalHtml;
          return;
        }
        const safe = term.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
        const re = new RegExp('(' + safe + ')', 'gi');
        pre.innerHTML = originalHtml.replace(re, '<span class="highlight">$1</span>');
      };
    }
    attachSearch();
  <\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  if (popupRef && !popupRef.closed) {
    popupRef.location.href = url;
    popupRef.focus();
  } else {
    popupRef = window.open(url, "_blank");
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function highlightJson(escapedJson: string): string {
  return escapedJson.replace(
    /(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (match, str, colon, bool) => {
      if (str) {
        return colon
          ? `<span class="key">${str}</span>${colon}`
          : `<span class="string">${str}</span>`;
      }
      if (bool) {
        return `<span class="${bool === "null" ? "null" : "boolean"}">${bool}</span>`;
      }
      return `<span class="number">${match}</span>`;
    },
  );
}

function handleKeydown(e: KeyboardEvent) {
  if (
    e.altKey &&
    (e.key === "d" || e.key === "D" || e.code === "KeyD" || e.key === "∂")
  ) {
    e.preventDefault();
    openPrismicData("page");
  }
}

async function handleMessage(e: MessageEvent) {
  if (e.data?.type === "prismic-devtool-request" && e.data?.mode) {
    const mode = e.data.mode as Mode;
    const result = await fetchData(mode);
    if (popupRef && !popupRef.closed) {
      popupRef.postMessage(
        { type: "prismic-devtool-response", payload: result },
        "*",
      );
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("message", handleMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("message", handleMessage);
});
</script>
