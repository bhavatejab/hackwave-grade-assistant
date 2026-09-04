import { reportService } from '../api/reportService'
import { AnalyticsOverview } from '../api/mockReports'

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsOverview> {
    return reportService.getAnalytics()
  },
}
