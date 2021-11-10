import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetMaterials =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_MATERIALS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/material/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_MATERIALS_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_MATERIALS, payload: false });
    }
  };
  export const getMaterialList = (params = {}) => {
    return api({
      method: "get",
      url: `/admin/material/search`,
      params,
    });
  };
export const actionAddMaterial = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/material`,
    data,
  });
};

export const actionEditMaterial = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/material/${id}`,
    data,
  });
};

export const actionDeleteMaterial = (id) => {
  return api({
    method: "delete",
    url: `/admin/material/${id}`,
  });
};

export const actionUploadMaterialUrl = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
