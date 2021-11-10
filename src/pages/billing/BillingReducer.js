import * as actions from "../../utils/constants/actions";

const initialState = {
  billings: {},
  isFetching: false,
};

const billing = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_BILLING:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_BILLING_DONE:
      return { ...state, billings: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default billing;
