import api from "../../utils/service/api";

export const actionGetExamQuestions = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/exam_question/search`,
    params,
  });
};
export const getExamQuestionList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/exam_question/search`,
    params,
  });
};
export const actionAddExamQuestion = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/exam_question`,
    data,
  });
};

export const actionEditExamQuestion = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/exam_question/${id}`,
    data,
  });
};

export const actionDeleteExamQuestion = (id) => {
  return api({
    method: "delete",
    url: `/admin/exam_question/${id}`,
  });
};
