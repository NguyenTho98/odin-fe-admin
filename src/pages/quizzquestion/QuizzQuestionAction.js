import api from "../../utils/service/api";

export const actionGetQuizzQuestions =(params = {}) => {
    return api({
      method: "get",
      url: `/admin/quizz_question/search`,
      params,
    });
};
export const getQuizzQuestionList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/quizz_question/search`,
    params,
  });
};
export const actionAddQuizzQuestion = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/quizz_question`,
    data,
  });
};

export const actionEditQuizzQuestion = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/quizz_question/${id}`,
    data,
  });
};

export const actionDeleteQuizzQuestion = (id) => {
  return api({
    method: "delete",
    url: `/admin/quizz_question/${id}`,
  });
};

export const actionUploadQuizzQuestionAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
