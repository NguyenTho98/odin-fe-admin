import * as actions from "../../utils/constants/actions";

const initialState = {
  orders: {},
  isFetching: false,
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ORDERS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ORDERS_DONE:
      return { ...state, orders: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default order;
