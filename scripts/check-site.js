const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const stylesheetPath = path.join(root, 'css', 'site.css');
const sketchPath = path.join(root, 'images', 'home-img-sketch.png');
const servedSketchPath = path.join(root, 'images', 'home-img-sketch.jpg');
const themeScriptPath = path.join(root, 'js', 'theme.js');
const skillsIndexPath = path.join(root, 'skills', 'index.html');
const skillsDataPath = path.join(root, 'skills', 'data.js');
const skillsScriptPath = path.join(root, 'skills', 'skills.js');
const skillsStylesheetPath = path.join(root, 'skills', 'skills.css');
const blogIndexPath = path.join(root, 'blog', 'index.html');
const blogPostPath = path.join(root, 'blog', 'opinion', '2026-08-14-friday-checkout-say-what.html');
const blogSourcePath = path.join(root, 'blog', 'opinion', '2026-08-14-friday-checkout-say-what.md');
const index = fs.readFileSync(indexPath, 'utf8');
const skillsIndex = fs.readFileSync(skillsIndexPath, 'utf8');
const skillsData = fs.readFileSync(skillsDataPath, 'utf8');
const skillsScript = fs.readFileSync(skillsScriptPath, 'utf8');
const skillsStylesheet = fs.readFileSync(skillsStylesheetPath, 'utf8');
const blogIndex = fs.readFileSync(blogIndexPath, 'utf8');
const blogPost = fs.readFileSync(blogPostPath, 'utf8');
const blogSource = fs.readFileSync(blogSourcePath, 'utf8');
const additionalBlogSlugs = [
  '2026-07-31-knowing-when-not-to-optimize',
  '2026-07-27-if-you-cannot-explain-the-work',
  '2026-07-24-cut-through-the-noise',
  '2026-07-20-ai-at-work-hiring-process',
  '2026-07-17-attention-is-all-you-need',
  '2026-07-13-claude-code-stay-inside-the-frame',
];
const additionalBlogFiles = additionalBlogSlugs.flatMap((slug) => [
  [`blog/opinion/${slug}.html`, fs.readFileSync(path.join(root, 'blog', 'opinion', `${slug}.html`), 'utf8')],
  [`blog/opinion/${slug}.md`, fs.readFileSync(path.join(root, 'blog', 'opinion', `${slug}.md`), 'utf8')],
]);
const technicalBlogSlugs = [
  '2023-10-05-hot-take-knowing-how-to-code-does-not-make-you-a-software-engineer-37al',
  '2023-10-10-beginner-topic-file-upload-with-multer-in-nodejs-99m',
  '2023-10-11-hot-take-you-burnt-out-and-it-was-your-fault-14og',
  '2023-10-13-tool-preview-markdown-document-on-your-terminal-2n8d',
  '2023-10-17-postgresql-pseudocolumns-ctid-108a',
  '2023-10-19-tip-never-forget-a-consolelog-in-your-patch-again-4c3b',
  '2023-10-20-frontend-vs-backend-an-objective-look-14f0',
  '2023-10-22-sql-joins-identifying-the-left-and-right-table-4nkb',
  '2023-10-24-you-dont-need-axios-34j9',
  '2023-11-01-containers-the-what-why-and-how-391n',
  '2023-11-08-docker-and-kubernetes-from-localhost-to-production-kubernetes-container-orchestrators-the-what-why-and-how-42gg',
  '2023-11-10-infer-function-return-type-in-typescript-4mko',
  '2023-11-23-kubernetes-services-expose-your-app-to-the-internet-o13',
  '2023-11-28-future-of-software-engineering-is-maintainability-still-important-2b0',
  '2023-12-09-notify-yourself-after-completing-a-long-running-bash-process-5f42',
];
const technicalBlogFiles = technicalBlogSlugs.flatMap((slug) => [
  [`blog/technical/${slug}.html`, fs.readFileSync(path.join(root, 'blog', 'technical', `${slug}.html`), 'utf8')],
  [`blog/technical/${slug}.md`, fs.readFileSync(path.join(root, 'blog', 'technical', `${slug}.md`), 'utf8')],
]);
// Matches the wordmark link and its decorative image without pinning attribute
// order, so unrelated attributes can be added without a spurious failure.
const WORDMARK_LINK_WITH_DECORATIVE_SKETCH_RE = /<a\s+class="wordmark"[^>]*aria-label="Olufisayo Bamidele home"[^>]*>\s*<img\s+[^>]*alt=""[^>]*>\s*<\/a>/;
// The stored-theme key is written by the inline head script and read back by
// js/theme.js; if the two drift, every reload silently discards the choice.
const THEME_STORAGE_KEY = 'ngfizzy-theme';

const requiredSnippets = [
  '<main id="top">',
  'class="wordmark" href="#top" aria-label="Olufisayo Bamidele home"',
  'id="home"',
  'href="css/site.css"',
  'id="about"',
  'id="contact"',
  'id="skills"',
  'id="work"',
  'id="career"',
  'data-theme-toggle',
  'src="js/theme.js"',
  'Python · TypeScript · JavaScript · Go',
  'Docker · Kubernetes · Terraform · Helm · AWS · Google Cloud',
  'src="images/home-img-sketch.jpg"',
  'alt="Black-and-white sketch portrait of Olufisayo Bamidele"',
  'https://www.medium.com/fisiwizy',
  'https://www.linkedin.com/in/olufisayo-bamidele-386b94129',
  'I build backend platforms, APIs, and the internal tools teams rely on to run them.',
  'Working mainly in Python and TypeScript',
  'https://github.com/ngfizzy/skills',
  'https://github.com/ngfizzy/service-provider-directory',
  'https://github.com/ngfizzy/express-auth',
  'https://github.com/ngfizzy/blog-demos',
  'href="skills/"',
  'Senior Full-stack Engineer <span>Smava / Finanzcheck</span>',
  'Senior Software Engineer <span>ComX.io</span>',
  'Platform Engineer / Security Engineer <span>Chipper Cash</span>',
  'Technical Team Lead <span>Gotahia</span>',
  'Software Engineer <span>Andela</span>',
  'The Linux Foundation, Safaricom Digifarm, Quoter, and CleanChoice Energy',
];

const skillsRequiredSnippets = [
  ['skills/index.html', skillsIndex, 'id="skill-search"'],
  ['skills/index.html', skillsIndex, 'id="skill-detail"'],
  ['skills/index.html', skillsIndex, 'src="data.js"'],
  ['skills/index.html', skillsIndex, 'src="skills.js"'],
  ['skills/data.js', skillsData, 'window.PUBLIC_SKILLS'],
  ['skills/data.js', skillsData, 'name: \'better-docs\''],
  ['skills/data.js', skillsData, 'name: \'execution-path-tracing\''],
  ['skills/skills.js', skillsScript, 'make install SKILL='],
  ['skills/skills.js', skillsScript, 'navigator.clipboard.writeText'],
  ['skills/skills.js', skillsScript, "if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function')"],
  ['skills/skills.css', skillsStylesheet, '.install-box'],
];

const blogRequiredSnippets = [
  ['blog/index.html', blogIndex, 'opinion/2026-08-14-friday-checkout-say-what.html'],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.html', blogPost, 'Friday Checkout: Say What?'],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.md', blogSource, 'date: 2026-08-14'],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.md', blogSource, 'exactly once.'],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.html', blogPost, 'exactly once.</blockquote>'],
];

// Contact routes the author keeps private. Matched by scheme and host so the
// removed address and handle stay out of this file too.
const forbiddenSnippets = [
  'mailto:',
  'instagram.com',
];

for (const snippet of requiredSnippets) {
  if (!index.includes(snippet)) {
    throw new Error(`Expected site content is missing: ${snippet}`);
  }
}

for (const [label, source, snippet] of skillsRequiredSnippets) {
  if (!source.includes(snippet)) {
    throw new Error(`Expected skills directory content is missing from ${label}: ${snippet}`);
  }
}

for (const skillName of ['better-docs', 'cracked-debugging', 'document-runtime', 'execution-path-tracing', 'say-what']) {
  if (!skillsData.includes(`name: '${skillName}'`) || !skillsData.includes(`make install SKILL=${skillName}`) && !skillsScript.includes('make install SKILL=')) {
    throw new Error(`The skills directory is missing ${skillName}.`);
  }
}

if (!WORDMARK_LINK_WITH_DECORATIVE_SKETCH_RE.test(index)) {
  throw new Error('The profile icon must be a decorative sketch inside the labeled home link.');
}

if (!fs.existsSync(stylesheetPath)) {
  throw new Error('The site stylesheet is missing.');
}

if (!fs.existsSync(themeScriptPath)) {
  throw new Error('The theme script is missing, so the theme toggle would not work.');
}

const themeScript = fs.readFileSync(themeScriptPath, 'utf8');
const stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
const authoredSources = [
  ['index.html', index],
  ['blog/index.html', blogIndex],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.html', blogPost],
  ['blog/opinion/2026-08-14-friday-checkout-say-what.md', blogSource],
  ...additionalBlogFiles,
  ...technicalBlogFiles,
  ['css/site.css', stylesheet],
  ['js/theme.js', themeScript],
];

for (const [label, source] of [['index.html', index], ['js/theme.js', themeScript]]) {
  if (!source.includes(THEME_STORAGE_KEY)) {
    throw new Error(`${label} must use the '${THEME_STORAGE_KEY}' storage key to persist the theme.`);
  }
}

for (const [label, source, snippet] of blogRequiredSnippets) {
  if (!source.includes(snippet)) {
    throw new Error(`Expected blog content is missing from ${label}: ${snippet}`);
  }
}

for (const [label, source] of [['blog/index.html', blogIndex], ['blog/opinion/2026-08-14-friday-checkout-say-what.html', blogPost]]) {
  if (!source.includes('data-theme-toggle') || !source.includes('ngfizzy-theme')) {
    throw new Error(`${label} must preserve the shared theme contract.`);
  }
}

if (!themeScript.includes("localStorage.getItem(STORAGE_KEY)")) {
  throw new Error('The theme runtime must restore the saved theme before wiring the toggle.');
}

for (const slug of additionalBlogSlugs) {
  const htmlLabel = `blog/opinion/${slug}.html`;
  const markdownLabel = `blog/opinion/${slug}.md`;
  const htmlSource = Object.fromEntries(additionalBlogFiles)[htmlLabel];
  const markdownSource = Object.fromEntries(additionalBlogFiles)[markdownLabel];

  if (!blogIndex.includes(`${slug}.html`)) {
    throw new Error(`The blog index must link to ${htmlLabel}.`);
  }

  if (!htmlSource.includes('data-theme-toggle') || !htmlSource.includes('theme.js')) {
    throw new Error(`${htmlLabel} must preserve the shared theme contract.`);
  }

  if (!markdownSource.startsWith('---\n') || !markdownSource.includes('title:') || !markdownSource.includes('description:')) {
    throw new Error(`${markdownLabel} must contain title and description front matter.`);
  }
}

for (const slug of technicalBlogSlugs) {
  const htmlLabel = `blog/technical/${slug}.html`;
  const markdownLabel = `blog/technical/${slug}.md`;
  const htmlSource = Object.fromEntries(technicalBlogFiles)[htmlLabel];
  const markdownSource = Object.fromEntries(technicalBlogFiles)[markdownLabel];

  if (!blogIndex.includes(`${slug}.html`)) {
    throw new Error(`The blog index must link to ${htmlLabel}.`);
  }

  if (!htmlSource.includes('data-theme-toggle') || !htmlSource.includes('theme.js')) {
    throw new Error(`${htmlLabel} must preserve the shared theme contract.`);
  }

  if (!markdownSource.startsWith('---\n') || !markdownSource.includes('title:') || !markdownSource.includes('description:')) {
    throw new Error(`${markdownLabel} must contain title and description front matter.`);
  }
}

for (const [label, source] of authoredSources) {
  for (const snippet of forbiddenSnippets) {
    if (source.includes(snippet)) {
      throw new Error(`${label} must not publish this private contact route: ${snippet}`);
    }
  }
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
  }

  return value >>> 0;
});

function calculatePngCrc(chunk) {
  let crc = 0xffffffff;

  for (const byte of chunk) {
    crc = (crc >>> 8) ^ PNG_CRC_TABLE[(crc ^ byte) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function assertValidPngData(png) {
  const idatChunks = [];
  let cursor = PNG_SIGNATURE.length;
  let height;
  let width;
  let hasIdat = false;
  let hasIend = false;
  let hasSeenNonIdatAfterIdat = false;

  if (!png.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error('The hero sketch image is not a PNG.');
  }

  while (!hasIend && cursor < png.length) {
    if (cursor + 12 > png.length) {
      throw new Error('The hero sketch image has a truncated PNG chunk header.');
    }

    const chunkLength = png.readUInt32BE(cursor);
    const chunkType = png.subarray(cursor + 4, cursor + 8).toString('ascii');
    const chunkDataStart = cursor + 8;
    const chunkDataEnd = chunkDataStart + chunkLength;
    const chunkCrcEnd = chunkDataEnd + 4;

    if (chunkCrcEnd > png.length) {
      throw new Error('The hero sketch image has a truncated PNG chunk.');
    }

    if (chunkType === 'IHDR') {
      if (cursor !== PNG_SIGNATURE.length || chunkLength !== 13) {
        throw new Error('The hero sketch image has an invalid IHDR chunk.');
      }

      width = png.readUInt32BE(chunkDataStart);
      height = png.readUInt32BE(chunkDataStart + 4);
    }

    if (chunkType === 'IDAT') {
      if (!width || !height || hasSeenNonIdatAfterIdat) {
        throw new Error('The hero sketch image has IDAT chunks in an invalid order.');
      }

      hasIdat = true;
      idatChunks.push(png.subarray(chunkDataStart, chunkDataEnd));
    } else if (hasIdat && chunkType !== 'IEND') {
      hasSeenNonIdatAfterIdat = true;
    }

    if (chunkType === 'IEND') {
      if (!hasIdat || chunkLength !== 0) {
        throw new Error('The hero sketch image has an invalid IEND chunk.');
      }

      hasIend = true;
    }

    const expectedCrc = png.readUInt32BE(chunkDataEnd);
    const actualCrc = calculatePngCrc(png.subarray(cursor + 4, chunkDataEnd));

    if (actualCrc !== expectedCrc) {
      throw new Error(`The hero sketch image has an invalid ${chunkType} CRC.`);
    }

    cursor = chunkCrcEnd;
  }

  if (!width || !height || idatChunks.length === 0 || !hasIend || cursor !== png.length) {
    throw new Error('The hero sketch image is missing required PNG data.');
  }

  const compressedIdatData = Buffer.concat(idatChunks);
  const inflatedImageData = zlib.inflateSync(compressedIdatData, { info: true });

  if (inflatedImageData.engine.bytesWritten !== compressedIdatData.length) {
    throw new Error('The hero sketch image has trailing IDAT data.');
  }
}

function assertPngValidatorRejectsTrailingIdatData(png) {
  let cursor = PNG_SIGNATURE.length;
  let lastIdatChunk;

  while (cursor < png.length) {
    const chunkLength = png.readUInt32BE(cursor);
    const chunkType = png.subarray(cursor + 4, cursor + 8).toString('ascii');
    const chunkDataStart = cursor + 8;
    const chunkDataEnd = chunkDataStart + chunkLength;

    if (chunkType === 'IDAT') {
      lastIdatChunk = { chunkDataEnd, chunkDataStart, chunkLength, cursor };
    }

    cursor = chunkDataEnd + 4;
  }

  if (!lastIdatChunk) {
    throw new Error('The PNG validation regression fixture needs an IDAT chunk.');
  }

  const originalIdatData = png.subarray(lastIdatChunk.chunkDataStart, lastIdatChunk.chunkDataEnd);
  const trailingIdatData = Buffer.concat([originalIdatData, Buffer.from([0, 0])]);
  const replacementChunk = Buffer.alloc(8);
  replacementChunk.writeUInt32BE(trailingIdatData.length, 0);
  replacementChunk.write('IDAT', 4, 'ascii');
  const replacementCrc = Buffer.alloc(4);
  replacementCrc.writeUInt32BE(calculatePngCrc(Buffer.concat([replacementChunk.subarray(4), trailingIdatData])), 0);
  const corruptedPng = Buffer.concat([
    png.subarray(0, lastIdatChunk.cursor),
    replacementChunk,
    trailingIdatData,
    replacementCrc,
    png.subarray(lastIdatChunk.chunkDataEnd + 4),
  ]);

  try {
    assertValidPngData(corruptedPng);
  } catch {
    return;
  }

  throw new Error('The PNG validator accepts trailing IDAT data.');
}

function assertValidPng(filePath) {
  const png = fs.readFileSync(filePath);

  assertValidPngData(png);
  assertPngValidatorRejectsTrailingIdatData(png);
}

function assertReadableJpeg(filePath) {
  const jpeg = fs.readFileSync(filePath);
  const hasJpegMarkers = jpeg.length >= 4
    && jpeg[0] === 0xff
    && jpeg[1] === 0xd8
    && jpeg.at(-2) === 0xff
    && jpeg.at(-1) === 0xd9;

  if (!hasJpegMarkers) {
    throw new Error('The served hero sketch image is not a complete JPEG.');
  }
}

try {
  assertValidPng(sketchPath);
  assertReadableJpeg(servedSketchPath);
} catch (error) {
  throw new Error(`The hero sketch image is invalid: ${error.message}`);
}

console.log('Site structure checks passed.');
