import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetOrdersMentor =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ORDERS_MENTOR, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/orders-mentor/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ORDERS_MENTOR_DONE, payload: data });
    } catch (error) {
      dispatch({ type: actionType.FETCHING_ORDERS_MENTOR, payload: false });
    }
  };

export const actionAddOrdersMentor = (data = {}) => {
  return api({ method: "post", url: `/admin/orders-mentor`, data });
};

export const actionEditOrdersMentor = (data = {}, id) => {
  return api({ method: "put", url: `/admin/orders-mentor/${id}`, data });
};

export const actionDeleteOrdersMentor = (id) => {
  return api({ method: "delete", url: `/admin/orders-mentor/${id}` });
};
