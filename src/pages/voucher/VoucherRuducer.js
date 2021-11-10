import * as actions from "../../utils/constants/actions";

const initialState = {
  vouchers: {},
  isFetching: false,
};

const voucher = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_VOUCHER:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_VOUCHER_DONE:
      return { ...state, vouchers: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default voucher;
