import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetUsers =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_USERS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/user/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_USERS_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_USERS, payload: false });
    }
  };
export const getUserList = (params = {}) => {
  return api({
    method: "get",
    url: `/users`,
    params,
  });
};

export const actionAddUser = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/user`,
    data,
  });
};

export const actionEditUser = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/user/${id}`,
    data,
  });
};
export const actionGetDetailUser = (data = {}, id) => {
  return api({
    method: "get",
    url: `/admin/user/detail/${id}`,
    data,
  });
};

export const actionDeleteUser = (id) => {
  return api({
    method: "delete",
    url: `/admin/user/${id}`,
  });
};

export const actionUploadUserAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
