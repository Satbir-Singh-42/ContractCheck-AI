const MAX_EXTRACTED_CHARS = 120_000;

function normalizeExtractedText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_EXTRACTED_CHARS);
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  if (pdfjsLib.GlobalWorkerOptions.workerSrc !== workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: await file.arrayBuffer(),
    isEvalSupported: false,
    useWorkerFetch: true,
  });

  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  let approxChars = 0;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');

    pages.push(pageText);
    approxChars += pageText.length;
    if (approxChars >= MAX_EXTRACTED_CHARS) break;
  }

  return normalizeExtractedText(pages.join('\n'));
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return normalizeExtractedText(value ?? '');
}

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'txt') {
    return normalizeExtractedText(await file.text());
  }

  if (ext === 'pdf') {
    return extractPdfText(file);
  }

  if (ext === 'docx') {
    return extractDocxText(file);
  }

  // DOC is a legacy binary format and is intentionally not supported here.
  return '';
}
