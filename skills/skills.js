(function () {
  'use strict';

  var skills = window.PUBLIC_SKILLS || [];
  var list = document.getElementById('skill-list');
  var detail = document.getElementById('skill-detail');
  var search = document.getElementById('skill-search');
  var status = document.getElementById('search-status');

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function renderMarkdown(markdown) {
    var lines = markdown.split('\n');
    var html = [];
    var inList = false;
    var listTag = null;
    var inCode = false;
    var code = [];

    function closeList() {
      if (inList) {
        html.push('</' + listTag + '>');
        inList = false;
        listTag = null;
      }
    }

    lines.forEach(function (line) {
      if (line.indexOf('```') === 0) {
        closeList();
        if (inCode) {
          html.push('<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>');
          code = [];
        }
        inCode = !inCode;
        return;
      }
      if (inCode) {
        code.push(line);
        return;
      }
      if (!line.trim()) {
        closeList();
        return;
      }
      if (line.indexOf('# ') === 0 || line.indexOf('## ') === 0 || line.indexOf('### ') === 0) {
        closeList();
        var level = line.indexOf('### ') === 0 ? 3 : line.indexOf('## ') === 0 ? 2 : 1;
        html.push('<h' + level + '>' + inlineMarkdown(line.slice(level + 1)) + '</h' + level + '>');
        return;
      }
      if (line.indexOf('- ') === 0) {
        if (!inList || listTag !== 'ul') {
          closeList();
          html.push('<ul>');
          inList = true;
          listTag = 'ul';
        }
        html.push('<li>' + inlineMarkdown(line.slice(2)) + '</li>');
        return;
      }
      if (/^\d+\. /.test(line)) {
        if (!inList || listTag !== 'ol') {
          closeList();
          html.push('<ol>');
          inList = true;
          listTag = 'ol';
        }
        html.push('<li>' + inlineMarkdown(line.replace(/^\d+\. /, '')) + '</li>');
        return;
      }
      closeList();
      html.push('<p>' + inlineMarkdown(line) + '</p>');
    });

    closeList();
    return html.join('');
  }

  function filteredSkills() {
    var query = search.value.trim().toLowerCase();
    return skills.filter(function (skill) {
      return !query || [skill.name, skill.title, skill.description].join(' ').toLowerCase().indexOf(query) !== -1;
    });
  }

  function renderList() {
    var matches = filteredSkills();
    status.textContent = matches.length + ' skill' + (matches.length === 1 ? '' : 's') + ' found.';
    list.innerHTML = matches.map(function (skill) {
      return '<article class="card skill-card"><p class="card-meta">Agent skill</p><h3><a href="#' + skill.name + '">' + escapeHtml(skill.title) + '</a></h3><p>' + escapeHtml(skill.description) + '</p><p class="skill-slug">' + escapeHtml(skill.name) + '</p></article>';
    }).join('');
  }

  function showDetail() {
    var name = window.location.hash.slice(1);
    var skill = skills.find(function (candidate) { return candidate.name === name; });
    if (!skill) {
      detail.hidden = true;
      return;
    }
    detail.hidden = false;
    detail.innerHTML = '<div class="detail-header"><a class="text-link" href="#top">← All skills</a><p class="eyebrow">' + escapeHtml(skill.name) + '</p><h2>' + escapeHtml(skill.title) + '</h2><p class="lede">' + escapeHtml(skill.description) + '</p><div class="install-box"><div><p class="eyebrow">Install this skill</p><code>make install SKILL=' + escapeHtml(skill.name) + '</code></div><button class="ghost-button small copy-command" type="button" data-command="make install SKILL=' + escapeHtml(skill.name) + '">Copy command</button></div><p><a class="text-link" href="' + skill.source + '">Read on GitHub ↗</a></p></div><article class="readme post-content">' + renderMarkdown(skill.readme) + '</article>';
    var copyButton = detail.querySelector('.copy-command');
    copyButton.addEventListener('click', function () {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        copyButton.textContent = 'Copy unavailable';
        return;
      }
      navigator.clipboard.writeText(copyButton.dataset.command).then(function () {
        copyButton.textContent = 'Copied';
      }).catch(function () {
        copyButton.textContent = 'Copy unavailable';
      });
    });
    detail.scrollIntoView({ block: 'start' });
  }

  search.addEventListener('input', renderList);
  window.addEventListener('hashchange', showDetail);
  renderList();
  showDetail();
})();
