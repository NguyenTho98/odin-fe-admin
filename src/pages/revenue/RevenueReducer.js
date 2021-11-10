import * as actions from "../../utils/constants/actions";

const initialState = {
  revenues: {},
  revenueDebts: {},
  isFetching: false,
};

const revenue = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_REVENUE:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_REVENUE_DONE:
      return { ...state, revenues: action.payload, isFetching: false };
    case actions.FETCH_REVENUE_DEBT_DONE:
      return { ...state, revenueDebts: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default revenue;
