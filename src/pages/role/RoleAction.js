import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetRoles =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ROLES, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/role/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ROLES_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_ROLES, payload: false });
    }
  };
export const getRoleList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/role/search`,
    params,
  });
};

export const actionGetDetailRole = (id) => {
  return api({
    method: "get",
    url: `/admin/role/${id}`,
  });
};
export const actionAddRole = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/role`,
    data,
  });
};

export const actionEditRole = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/role/${id}`,
    data,
  });
};

export const actionDeleteRole = (id) => {
  return api({
    method: "delete",
    url: `/admin/role/${id}`,
  });
};

export const actionUploadRoleAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
