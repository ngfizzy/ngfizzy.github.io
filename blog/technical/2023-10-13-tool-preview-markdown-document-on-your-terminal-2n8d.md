---
title: "Tool: Preview Markdown Document on Your Terminal"
date: 2023-10-13
description: "If you've recently been initiated into the Vim users cult and, like me,  you also don't like leaving..."
---

<p>If you've recently been initiated into the Vim users cult and, like me,  you also don't like leaving your terminal that much anymore, you're probably being forced to do so whenever you want to do stuff like previewing your markdown documents. Sweat no more; <code>glow</code> got you covered.</p>

<h2>
  <a name="installation" href="#installation">
  </a>
  Installation
</h2>

<p>On Mac, <code>brew install glow</code>.</p>

<h2>
  <a name="usage" href="#usage">
  </a>
  Usage
</h2>

<p>Usage: <code>glow MyWonderfulDoc.md</code></p>

<h2>
  <a name="alternative-markdown-lynx" href="#alternative-markdown-lynx">
  </a>
  Alternative: markdown + lynx
</h2>

<p><strong>Markdown</strong>: This is a command line tool for converting your MD files to HTML<br>
<strong>Lynx</strong>: A terminal-based web browser for rendering HTML pages.</p>
<h3>
  <a name="installation" href="#installation">
  </a>
  Installation
</h3>


<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>brew <span class="nb">install </span>lynx markdown
</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<h3>
  <a name="usage" href="#usage">
  </a>
  Usage
</h3>

<p>Convert your MD file to HTML with markdown and pipe the output to Lynx<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>markdown MyWonderfulDoc.md | lynx <span class="nt">-stdin</span>
</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>
