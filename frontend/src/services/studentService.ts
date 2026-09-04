import { reportService } from '../api/reportService'
import { StudentHistoryItem } from '../api/mockReports'

export const studentService = {
  async getStudentHistory(studentUUID: string): Promise<StudentHistoryItem[]> {
    return reportService.getStudentHistory(studentUUID)
  },

  async getSampleUUIDs(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return ['STU-A91F23', 'STU-B42C89', 'STU-C78D12', 'STU-D34E56', 'STU-E89F01']
  },
}
