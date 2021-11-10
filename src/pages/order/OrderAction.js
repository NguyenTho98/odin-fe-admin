import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetOrders =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ORDERS, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/orders/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ORDERS_DONE, payload: data });
    } catch (error) {
      dispatch({ type: actionType.FETCHING_ORDERS, payload: false });
    }
  };

export const actionAddOrder = (data = {}) => {
  return api({ method: "post", url: `/admin/orders`, data });
};

export const actionEditOrder = (data = {}, id) => {
  return api({ method: "put", url: `/admin/orders/${id}`, data });
};

export const actionDeleteOrder = (id) => {
  return api({ method: "delete", url: `/admin/orders/${id}` });
};
