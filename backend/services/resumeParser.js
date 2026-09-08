const path = require("path");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

function normalizeText(text = "") {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isPdfFile(file) {
  const fileName = (file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  return mimeType === "application/pdf" || path.extname(fileName) === ".pdf";
}

function isDocxFile(file) {
  const fileName = (file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  return (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    path.extname(fileName) === ".docx"
  );
}

async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    return normalizeText(result.text || "");
  } finally {
    await parser.destroy().catch(() => {});
  }
}

async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });

  return normalizeText(result.value || "");
}

async function parseResumeFile(file) {
  if (!file || !file.buffer) {
    const error = new Error("Missing uploaded resume data.");
    error.code = "MISSING_FILE";
    throw error;
  }

  if (isPdfFile(file)) {
    return extractPdfText(file.buffer);
  }

  if (isDocxFile(file)) {
    return extractDocxText(file.buffer);
  }

  const error = new Error("Only PDF and DOCX files are supported.");
  error.code = "UNSUPPORTED_FILE";
  throw error;
}

module.exports = {
  normalizeText,
  parseResumeFile,
};
