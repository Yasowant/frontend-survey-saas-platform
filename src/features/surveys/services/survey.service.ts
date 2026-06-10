import * as surveyApi from "../api/survey.api";

export const surveyService = {
  createSurvey: surveyApi.createSurvey,
  getSurveys: surveyApi.getSurveys,
  getSurveyById: surveyApi.getSurveyById,
  deleteSurvey: surveyApi.deleteSurvey,
  submitSurveyResponse: surveyApi.submitSurveyResponse,
};
