# AI Resume Analyzer

AI-powered resume screening and candidate comparison platform.

## Overview

AI Resume Analyzer helps recruiters compare multiple resumes against
a specific job requirement and generate ranked candidate recommendations.

## Features

- Admin authentication
- Multiple resume upload
- PDF and DOCX parsing
- Job requirement analysis
- AI-powered candidate scoring
- Candidate ranking
- Strengths and gaps analysis
- Local AI inference with Ollama
- Privacy-conscious in-memory file processing

## Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- Multer
- JWT

### AI
- Ollama
- Llama 3.2 3B

### Document Processing
- pdf-parse
- Mammoth

## Architecture

React
↓
Express API
↓
Resume Parser
↓
Ollama
↓
AI Analysis
↓
Candidate Ranking
↓
React Dashboard

## Version

v1.0.0

## Current Limitations

- Image-only/scanned PDFs require OCR.
- Analysis quality depends on the local model.
- Large batches may take longer because resumes are processed sequentially.
- AI output is an assistive recommendation and should not replace human review.

## Future Roadmap

- OCR support
- Better candidate comparison
- Persistent analysis history
- Candidate profiles
- Advanced scoring controls
- More AI models
- Analytics dashboard
