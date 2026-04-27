<template>
  <div />
</template>

<script setup lang="ts">
const { client } = usePrismic();
const route = useRoute();

async function openPrismicData() {
  const uid = route.params.uid as string | undefined;
  const path = route.path;

  let data: unknown = null;
  let error: string | null = null;
  let docType = "page";

  try {
    if (uid) {
      // Try to fetch by UID from the 'page' custom type first
      try {
        data = await client.getByUID("page", uid);
      } catch {
        // Fallback: try to resolve by path/any type
        const all = await client.get({ predicates: [] });
        data = all.results.find((r: any) => r.uid === uid) ?? all;
      }
    } else {
      // Homepage or non-UID route — try common single types
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
    :root {
      color-scheme: light dark;
    }
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
      position: sticky;
      top: 0;
      background: #252526;
      padding: 12px 20px;
      border-bottom: 1px solid #333;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      z-index: 10;
    }
    header h1 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    header .meta {
      color: #888;
      font-size: 12px;
    }
    header .meta strong {
      color: #4ec9b0;
      font-weight: 500;
    }
    .toolbar {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
    button {
      background: #0e639c;
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
    }
    button:hover { background: #1177bb; }
    button.secondary { background: #3a3d41; }
    button.secondary:hover { background: #4a4d51; }
    .search {
      padding: 8px 20px;
      background: #252526;
      border-bottom: 1px solid #333;
      position: sticky;
      top: 53px;
      z-index: 9;
    }
    .search input {
      width: 100%;
      padding: 6px 10px;
      background: #3c3c3c;
      border: 1px solid #555;
      color: #d4d4d4;
      border-radius: 3px;
      font-family: inherit;
      font-size: 12px;
    }
    .search input:focus {
      outline: none;
      border-color: #007acc;
    }
    pre {
      margin: 0;
      padding: 20px;
      white-space: pre-wrap;
      word-break: break-word;
      tab-size: 2;
    }
    .err {
      background: #5a1d1d;
      color: #f48771;
      padding: 12px 20px;
      margin: 20px;
      border-left: 3px solid #f48771;
      border-radius: 3px;
    }
    /* JSON syntax highlighting */
    .key { color: #9cdcfe; }
    .string { color: #ce9178; }
    .number { color: #b5cea8; }
    .boolean { color: #569cd6; }
    .null { color: #569cd6; }
    .highlight {
      background: #613a00;
      color: #fff;
    }
  </style>
</head>
<body>
  <header>
    <h1>Prismic Data</h1>
    <span class="meta">Route: <strong>${path}</strong></span>
    ${uid ? `<span class="meta">UID: <strong>${uid}</strong></span>` : ""}
    <span class="meta">Type: <strong>${docType}</strong></span>
    <div class="toolbar">
      <button onclick="copyJson()">Copy JSON</button>
      <button class="secondary" onclick="window.location.reload()">Refresh</button>
    </div>
  </header>
  <div class="search">
    <input id="search" type="text" placeholder="Filter (Ctrl+F also works)…" />
  </div>
  ${error ? `<div class="err">Error: ${error.replace(/</g, "&lt;")}</div>` : ""}
  <pre id="json">${highlightJson(escaped)}</pre>
  <script>
    const rawJson = ${JSON.stringify(json)};
    function copyJson() {
      navigator.clipboard.writeText(rawJson).then(() => {
        const btn = document.querySelector('button');
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 1200);
      });
    }
    const search = document.getElementById('search');
    const pre = document.getElementById('json');
    const originalHtml = pre.innerHTML;
    search.addEventListener('input', (e) => {
      const term = e.target.value;
      if (!term) {
        pre.innerHTML = originalHtml;
        return;
      }
      const safe = term.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
      const re = new RegExp('(' + safe + ')', 'gi');
      pre.innerHTML = originalHtml.replace(re, '<span class="highlight">$1</span>');
    });
  <\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  // Revoke after a tick so the new tab has time to load
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Server-rendered tiny JSON highlighter (runs at template build time, in-line)
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
  // Option/Alt + D
  if (
    e.altKey &&
    (e.key === "d" || e.key === "D" || e.code === "KeyD" || e.key === "∂")
  ) {
    e.preventDefault();
    openPrismicData();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
