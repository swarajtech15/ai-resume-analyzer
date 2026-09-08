const express = require("express");
const multer = require("multer");

const { parseResumeFile } = require("../services/resumeParser");
const { analyzeResumes } = require("../services/aiAnalyzer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024,
    files: 25,
  },
});

function isSupportedResumeFile(file) {
  const fileName = (file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  return (
    mimeType === "application/pdf" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".pdf") ||
    fileName.endsWith(".docx")
  );
}

function createAnalyzeRouter(authenticateAdmin) {
  const router = express.Router();

  router.post(
    "/analyze",
    authenticateAdmin,
    upload.array("resumes"),
    async (req, res) => {
      try {
        const requirement = String(req.body.requirement || "").trim();
        const uploadedFiles = Array.isArray(req.files) ? req.files : [];

        if (!requirement) {
          return res.status(400).json({
            success: false,
            message: "A job requirement description is required.",
          });
        }

        if (uploadedFiles.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Please upload at least one PDF or DOCX resume.",
          });
        }

        const invalidFile = uploadedFiles.find((file) => !isSupportedResumeFile(file));

        if (invalidFile) {
          return res.status(400).json({
            success: false,
            message: `Unsupported file type: ${invalidFile.originalname}. Please upload PDF or DOCX files only.`,
          });
        }

        const resumes = [];

        for (const file of uploadedFiles) {
          try {
            const resumeText = await parseResumeFile(file);

            resumes.push({
              fileName: file.originalname,
              resumeText,
            });
          } catch (error) {
            console.error(`Resume extraction failed for ${file.originalname}:`, error.message);

            resumes.push({
              fileName: file.originalname,
              resumeText: "",
            });
          }
        }

        const candidates = await analyzeResumes({
          resumes,
          jobRequirement: requirement,
        });

        return res.json({
          success: true,
          message: "Resume analysis completed successfully.",
          candidates,
        });
      } catch (error) {
        console.error("Analyze route error:", error);

        return res.status(500).json({
          success: false,
          message: error.message || "Unable to analyze resumes.",
        });
      }
    },
  );

  return router;
}

module.exports = createAnalyzeRouter;
