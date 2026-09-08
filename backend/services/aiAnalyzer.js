const { Ollama } = require("ollama");

const MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";

const ollama = new Ollama({ host: OLLAMA_HOST });

function normalizeText(text = "") {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clampScore(value) {
  const number = Number.parseInt(value, 10);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, number));
}

function fitFromScore(score) {
  if (score >= 85) {
    return "Strong";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Partial";
  }

  return "Low";
}

function safeArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => String(value).trim())
    .filter(Boolean)
    .slice(0, 6);
}

function stripJsonWrappers(text = "") {
  const trimmed = String(text).trim();

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  return trimmed;
}

function parseModelResponse(text) {
  const cleaned = stripJsonWrappers(text);
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(candidate);
    } catch {
      // Fall through to the raw parse attempt below.
    }
  }

  return JSON.parse(cleaned);
}

function buildPrompt({ fileName, jobRequirement, resumeText }) {
  return `
You are an AI resume screening assistant.

Task:
Evaluate the resume only against the job requirement below.

Hiring safety rules:
- Use only job-related information.
- Do not use or infer race, religion, gender, age, disability, nationality, marital status, appearance, or any other protected/sensitive attribute.
- Treat this as an AI-assisted recommendation, not a final hiring decision.

Output rules:
- Return valid JSON only.
- Do not include markdown, code fences, or commentary.
- Use this exact shape:
  {
    "score": 0,
    "fit": "Strong | Good | Partial | Low",
    "summary": "string",
    "strengths": ["string"],
    "gaps": ["string"]
  }
- Score must be an integer from 0 to 100.
- Rank fit using score:
  Strong = 85-100
  Good = 70-84
  Partial = 50-69
  Low = 0-49
- Keep summary concise and job-focused.
- strengths and gaps must be arrays of short strings.

Job requirement:
${jobRequirement}

Resume file:
${fileName}

Resume text:
${resumeText}
`.trim();
}

function fallbackAnalysis(fileName, reason) {
  return {
    fileName,
    score: 0,
    fit: "Low",
    summary: reason || "AI analysis could not be completed for this resume.",
    strengths: [],
    gaps: [reason || "No analysable content was available."],
  };
}

async function analyzeResume({ fileName, jobRequirement, resumeText }) {
  const trimmedResume = normalizeText(resumeText);

  if (!trimmedResume) {
    return fallbackAnalysis(
      fileName,
      "No readable resume text could be extracted from this file.",
    );
  }

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You return only valid JSON for resume evaluation and ignore protected characteristics.",
        },
        {
          role: "user",
          content: buildPrompt({
            fileName,
            jobRequirement,
            resumeText: trimmedResume.slice(0, 12000),
          }),
        },
      ],
      format: "json",
      options: {
        temperature: 0.2,
      },
    });

    const content =
      response?.message?.content ??
      response?.response ??
      response?.content ??
      "";

    const parsed = parseModelResponse(content);
    const score = clampScore(parsed.score);

    return {
      fileName,
      score,
      fit: fitFromScore(score),
      summary: String(parsed.summary || "").trim() || "No summary returned by the model.",
      strengths: safeArray(parsed.strengths),
      gaps: safeArray(parsed.gaps),
    };
  } catch (error) {
    console.error(`Ollama analysis failed for ${fileName}:`, error.message);

    return fallbackAnalysis(
      fileName,
      "The local AI model could not complete this resume analysis.",
    );
  }
}

async function analyzeResumes({ resumes, jobRequirement }) {
  const results = [];

  for (const resume of resumes) {
    // Run sequentially so the local model stays responsive on smaller machines.
    const analysis = await analyzeResume({
      fileName: resume.fileName,
      resumeText: resume.resumeText,
      jobRequirement,
    });

    results.push(analysis);
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.fileName.localeCompare(b.fileName);
  });
}

module.exports = {
  analyzeResume,
  analyzeResumes,
  clampScore,
  fitFromScore,
};
