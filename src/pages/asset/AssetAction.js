import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetAssets =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ASSET, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/asset/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ASSET_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_ASSET, payload: false });
    }
  };
export const getAssetList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/asset/search`,
    params,
  });
};
export const actionAddAsset = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/asset`,
    data,
  });
};

export const actionEditAsset = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/asset/${id}`,
    data,
  });
};

export const actionDeleteAsset = (id) => {
  return api({
    method: "delete",
    url: `/admin/asset/${id}`,
  });
};

export const actionUploadAssetLink = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
