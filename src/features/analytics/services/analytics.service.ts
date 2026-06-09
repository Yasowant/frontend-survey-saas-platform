import * as analyticsApi from "../api/analytics.api";

export const analyticsService = {
  getDashboardAnalytics: analyticsApi.getDashboardAnalytics,
  getSurveyAnalytics: analyticsApi.getSurveyAnalytics,
};
