import * as surveyApi from "../api/survey.api";

export const surveyService = {
  createSurvey: surveyApi.createSurvey,
  getSurveys: surveyApi.getSurveys,
  getSurveyById: surveyApi.getSurveyById,
  getPublicSurvey: surveyApi.getPublicSurvey,
  updateSurvey: surveyApi.updateSurvey,
  deleteSurvey: surveyApi.deleteSurvey,
  publishSurvey: surveyApi.publishSurvey,
  closeSurvey: surveyApi.closeSurvey,
  submitSurveyResponse: surveyApi.submitSurveyResponse,
  submitPublicSurveyResponse: surveyApi.submitPublicSurveyResponse,
};
