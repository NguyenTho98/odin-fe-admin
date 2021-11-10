import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetRevenues =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_REVENUE, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/revenue/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_REVENUE_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_REVENUE, payload: false });
    }
  };
export const actionGetRevenueDebts =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_REVENUE, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/revenue/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_REVENUE_DEBT_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_REVENUE, payload: false });
    }
  };
export const getRevenueList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/revenue/search`,
    params,
  });
};
export const actionAddRevenue = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/revenue`,
    data,
  });
};

export const actionEditRevenue = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/revenue/${id}`,
    data,
  });
};

export const actionDeleteRevenue = (id) => {
  return api({
    method: "delete",
    url: `/admin/revenue/${id}`,
  });
};

export const actionUploadRevenueAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
export const getRevenueDetail = (revenueId) => {
  return api({
    method: "get",
    url: `/admin/revenue/search`,
    params: {
      query: `id=="${revenueId}"`,
    },
  });
};
