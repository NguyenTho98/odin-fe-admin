import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetBillings =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_BILLING, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/billing/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_BILLING_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_BILLING, payload: false });
    }
  };
export const getBillingList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/billing/search`,
    params,
  });
};
export const actionAddBilling = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/billing`,
    data,
  });
};

export const actionEditBilling = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/billing/${id}`,
    data,
  });
};

export const actionDeleteBilling = (id) => {
  return api({
    method: "delete",
    url: `/admin/billing/${id}`,
  });
};

export const actionUploadBillingAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
