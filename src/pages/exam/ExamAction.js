import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetExams =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_EXAMS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/exam/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_EXAMS_DONE, payload: data });
    } catch (error) {
      dispatch({ type: actionType.FETCHING_EXAMS, payload: false });
    }
  };

export const actionAddExam = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/exam`,
    data,
  });
};

export const actionEditExam = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/exam/${id}`,
    data,
  });
};

export const actionDeleteExam = (id) => {
  return api({
    method: "delete",
    url: `/admin/exam/${id}`,
  });
};
