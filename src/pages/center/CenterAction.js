import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetCenters =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_CENTER, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/center`,
        params,
      });

      dispatch({ type: actionType.FETCH_CENTER_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_CENTER, payload: false });
    }
  };
export const getCenterList = (params = {}) => {
  return api({
    method: "get",
    url: `/center`,
    params,
  });
};
export const actionAddCenter = (data = {}) => {
  return api({
    method: "post",
    url: `/center`,
    data,
  });
};

export const actionEditCenter = (data = {}, id) => {
  return api({
    method: "put",
    url: `/center/${id}`,
    data,
  });
};

export const actionDeleteCenter = (id) => {
  return api({
    method: "delete",
    url: `/center/${id}`,
  });
};

export const actionUploadCenterAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
