import * as actions from "../../utils/constants/actions";

const initialState = {
  ordersMentor: {},
  isFetching: false,
};

const orderMentor = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ORDERS_MENTOR:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ORDERS_MENTOR_DONE:
      return { ...state, ordersMentor: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default orderMentor;
