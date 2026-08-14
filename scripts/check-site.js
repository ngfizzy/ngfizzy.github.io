const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const stylesheetPath = path.join(root, 'css', 'site.css');
const sketchPath = path.join(root, 'images', 'home-img-sketch.png');
const servedSketchPath = path.join(root, 'images', 'home-img-sketch.jpg');
const index = fs.readFileSync(indexPath, 'utf8');

const requiredSnippets = [
  '<main id="top">',
  'id="home"',
  'href="css/site.css"',
  'id="about"',
  'id="contact"',
  'id="skills"',
  'Python · TypeScript · JavaScript · Go',
  'Docker · Kubernetes · Terraform · Helm · AWS · Google Cloud',
  'src="images/home-img-sketch.jpg"',
  'alt="Black-and-white sketch portrait of Olufisayo Bamidele"',
  'mailto:fisiwizy@gmail.com',
  'https://www.instagram.com/ng_fizzy/',
  'https://www.medium.com/fisiwizy',
  'https://www.linkedin.com/in/olufisayo-bamidele-386b94129',
  'I build backend platforms, product systems, and the tools that help teams run them.',
  'Working mainly in Python and TypeScript',
  'https://github.com/ngfizzy/skills',
  'https://github.com/ngfizzy/service-provider-directory',
  'https://github.com/ngfizzy/express-auth',
  'https://github.com/ngfizzy/blog-demos',
  'Senior Full-stack Engineer <span>Smava / Finanzcheck</span>',
  'Senior Software Engineer <span>ComX.io</span>',
  'Platform Engineer / Security Engineer <span>Chipper Cash</span>',
  'Technical Team Lead <span>Gotahia</span>',
  'Software Engineer <span>Andela</span>',
  'The Linux Foundation, Safaricom Digifarm, Quoter, and CleanChoice Energy',
];

for (const snippet of requiredSnippets) {
  if (!index.includes(snippet)) {
    throw new Error(`Expected site content is missing: ${snippet}`);
  }
}

if (!fs.existsSync(stylesheetPath)) {
  throw new Error('The site stylesheet is missing.');
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
