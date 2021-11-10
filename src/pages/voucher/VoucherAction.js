import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetVouchers =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_VOUCHER, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/voucher/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_VOUCHER_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_VOUCHER, payload: false });
    }
  };
export const getVoucherList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/voucher/search`,
    params,
  });
};
export const actionAddVoucher = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/voucher`,
    data,
  });
};

export const actionEditVoucher = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/voucher/${id}`,
    data,
  });
};

export const actionDeleteVoucher = (id) => {
  return api({
    method: "delete",
    url: `/admin/voucher/${id}`,
  });
};

export const actionUploadVoucherAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
