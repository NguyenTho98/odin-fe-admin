import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetStudys =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_STUDY, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/study`,
        params,
      });

      dispatch({ type: actionType.FETCH_STUDY_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_STUDY, payload: false });
    }
  };
export const getStudyList = (params = {}) => {
  return api({
    method: "get",
    url: `/study`,
    params,
  });
};
export const actionAddStudy = (data = {}) => {
  return api({
    method: "post",
    url: `/study`,
    data,
  });
};

export const actionEditStudy = (data = {}, id) => {
  return api({
    method: "put",
    url: `/study/${id}`,
    data,
  });
};

export const actionDeleteStudy = (id) => {
  return api({
    method: "delete",
    url: `/study/${id}`,
  });
};

export const actionUploadStudyAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
