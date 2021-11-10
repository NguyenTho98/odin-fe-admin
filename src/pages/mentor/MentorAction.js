import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetMentorList =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_MENTOR, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/mentor/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_MENTOR_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_MENTOR, payload: false });
    }
  };

export const getMentorList = (params = {}) => {
  return api({ method: "get", url: `/admin/mentor/search`, params });
};

export const actionGetMentorDetail = (mentorId) => {
  const params = { page: 0, size: 1, query: `id==${mentorId}` };
  return api({ method: "get", url: `/admin/mentor/search`, params });
};

export const actionDeleteMentor = (id) => {
  return api({
    method: "delete",
    url: `/admin/mentor/${id}`,
  });
};

export const actionAddMentor = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/mentor`,
    data,
  });
};

export const actionUpdateMentor = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/mentor/${id}`,
    data,
  });
};
