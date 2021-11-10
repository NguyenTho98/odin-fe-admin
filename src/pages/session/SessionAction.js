import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetSessions =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_SESSIONS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/session/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_SESSIONS_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_SESSIONS, payload: false });
    }
  };
  export const getSessionList = (params = {}) => {
    return api({
      method: "get",
      url: `/admin/session/search`,
      params,
    });
  };
export const actionAddSession = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/session`,
    data,
  });
};

export const actionEditSession = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/session/${id}`,
    data,
  });
};

export const actionDeleteSession = (id) => {
  return api({
    method: "delete",
    url: `/admin/session/${id}`,
  });
};

export const actionUploadSessionAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
