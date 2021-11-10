import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetApis =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_APIS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/api/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_APIS_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_APIS, payload: false });
    }
  };

export const getApiList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/api/search`,
    params,
  });
};

export const actionGetDetailApi= (params = {}) => {
  return api({
    method: "get",
    url: `/admin/api/search`,
    params,
  });
};
export const actionAddApi = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/api`,
    data,
  });
};

export const actionEditApi = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/api/${id}`,
    data,
  });
};

export const actionDeleteApi = (id) => {
  return api({
    method: "delete",
    url: `/admin/api/${id}`,
  });
};

export const actionUploadApiAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
