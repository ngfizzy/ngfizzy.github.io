---
title: "Notify Yourself After Completing a Long-Running Bash Process"
date: 2023-12-09
description: "Recently, I worked on projects that take a long time to build. I often stared at the screen, waiting..."
---

<p>Recently, I worked on projects that take a long time to build. I often stared at the screen, waiting for these to complete, which often resulted in me sleeping off at my desk. Later, I improvised sleeping while listening to some podcasts, but I usually lost valuable time since I couldn't tell when the long-running tasks were done. If only I could get notified if a bash process is done.</p>

<h2>
  <a name="say-hello-to-the-say-command" href="#say-hello-to-the-say-command">
  </a>
  Say hello to the "say" command
</h2>

<p>The say command takes a string of text and reads it out loud. The example below says "brew upgrade done" when you're done upgrading your brew packages.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>brew upgrade<span class="p">;</span> say, <span class="s2">"brew upgrade done."</span>
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



<p>Perhaps you often sleep off while listening to one of those monotonic dialogues between Lex Fridman and Elon; you could repeat the alert until you wake up with a little sprinkle of bash.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>brew upgrade<span class="p">;</span> <span class="k">for </span>i <span class="k">in</span> <span class="o">{</span>1..1000<span class="o">}</span><span class="p">;</span> <span class="k">do</span><span class="p">;</span> say <span class="s2">"brew upgrade done"</span><span class="p">;</span> <span class="k">done</span><span class="p">;</span>
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



<p>That would say "brew upgrade done" 1000 times unless you manually stop it(with ctrl+c).</p>

<p>If you don't wake up after 1000 iterations, you should close your laptop for the weekend sleep. Just sleep 😆. </p>

<blockquote>
<p>ℹ️ The say command comes preinstalled with Macos (I think), but its equivalent should be available on your Linux distro. For example, on my Ubuntu desktop installation, I have <code>spd-say.</code></p>
</blockquote>

<p>Alright, that's it. Have a great weekend, you all.</p>
