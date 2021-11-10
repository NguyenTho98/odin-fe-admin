import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetClassess =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_CLASSES, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/classes`,
        params,
      });

      dispatch({ type: actionType.FETCH_CLASSES_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_CLASSES, payload: false });
    }
  };
export const getClassesList = (params = {}) => {
  return api({
    method: "get",
    url: `/classes`,
    params,
  });
};
export const actionAddClasses = (data = {}) => {
  return api({
    method: "post",
    url: `/classes`,
    data,
  });
};

export const actionEditClasses = (data = {}, id) => {
  return api({
    method: "put",
    url: `/classes/${id}`,
    data,
  });
};

export const actionDeleteClasses = (id) => {
  return api({
    method: "delete",
    url: `/classes/${id}`,
  });
};

export const actionUploadClassesAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
