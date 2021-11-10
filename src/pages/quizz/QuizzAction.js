import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetQuizzes =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_QUIZZES, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/quizz/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_QUIZZES_DONE, payload: data });
    } catch (error) {
      dispatch({ type: actionType.FETCHING_QUIZZES, payload: false });
    }
  };

export const actionAddQuizz = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/quizz`,
    data,
  });
};

export const actionEditQuizz = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/quizz/${id}`,
    data,
  });
};

export const actionDeleteQuizz = (id) => {
  return api({
    method: "delete",
    url: `/admin/quizz/${id}`,
  });
};
