export interface CreateAssessmentPayload {
  name: string
  subject: string
  className: string
  section: string
  maximumMarks: number
  date: string
  instructions?: string
}

export interface AssessmentUploadProgress {
  fileType: 'question_paper' | 'rubric' | 'student_answers'
  fileName: string
  progress: number // 0-100
  status: 'uploading' | 'completed' | 'error'
}

export const assessmentService = {
  async createAssessment(payload: CreateAssessmentPayload): Promise<{ id: string; name: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const id = `ASM-${Date.now().toString().slice(-4)}`
    return { id, name: payload.name }
  },

  async uploadFile(
    file: File,
    fileType: 'question_paper' | 'rubric' | 'student_answers',
    onProgress?: (p: number) => void
  ): Promise<{ fileUrl: string; fileName: string }> {
    for (let i = 10; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (onProgress) onProgress(i)
    }
    return {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    }
  },
}
