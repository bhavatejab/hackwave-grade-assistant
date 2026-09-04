# 🎓 Smart Grade Assistant

AI-powered automated answer sheet evaluation platform that helps teachers grade descriptive answers with transparency, evidence, and human override.

---

## 🚀 Problem Statement

Manual evaluation of descriptive answer sheets is:

- Time-consuming
- Inconsistent between evaluators
- Difficult for large classrooms
- Lacks detailed analytics

Teachers spend hours grading while students wait for results.

---

## 💡 Our Solution

Smart Grade Assistant uses AI to evaluate scanned answer sheets using a teacher-provided answer key and rubric.

The system:

- Extracts text from uploaded PDFs/images
- Compares student answers with the model answer
- Scores every question
- Shows justification for every mark
- Allows teacher override
- Generates final reports automatically

Teachers remain fully in control.

---

## ✨ Features

### Teacher Dashboard

- Upload Question Paper
- Upload Rubric
- Upload Student Answer Sheet
- AI Evaluation
- Confidence Score
- Manual Override
- Final Report Generation

### AI Evaluation

- Semantic Answer Matching
- Rubric-based Marking
- Evidence Extraction
- Hallucination Reduction
- Transparent Explanations

### Reports

- Student-wise Reports
- Class Analytics
- Average Scores
- Manual Review Flags
- Download Reports

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- FastAPI
- Python

### AI

- OpenAI GPT
- OCR (planned)

### Storage

- Local JSON (Current Demo)

Future:

- Supabase
- PostgreSQL
- Authentication

---

## 📂 Project Structure

frontend/
backend/
docs/
screenshots/

---

## ⚙️ Installation

### Clone Repository

git clone <repo>

cd smart-grade-assistant

### Backend

cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend:

http://localhost:8000

Swagger:

http://localhost:8000/docs

### Frontend

cd frontend

npm install

npm run dev

Frontend:

http://localhost:5173

---

## 🔄 Workflow

Teacher

↓

Uploads Question Paper

↓

Uploads Rubric

↓

Uploads Student Answer Sheet

↓

AI Evaluation

↓

Teacher Review

↓

Override if Needed

↓

Final Report Generated

---

## 📸 Screenshots

Dashboard

Upload Screen

Evaluation Screen

Generated Report

Analytics Dashboard

---

## 🧠 AI Workflow

1. OCR extracts text
2. Rubric parsed
3. GPT evaluates answers
4. Marks assigned
5. Evidence generated
6. Confidence calculated
7. Teacher can override

---

## 🎯 Future Improvements

- Multi-language evaluation
- LMS integration
- Google Classroom support
- Supabase authentication
- Real-time collaboration
- Plagiarism detection
- Voice feedback

---

## 👥 Team

HackWave

Members

- Name 1
- Name 2
- Name 3
- Name 4

---

## 📄 License

MIT License
