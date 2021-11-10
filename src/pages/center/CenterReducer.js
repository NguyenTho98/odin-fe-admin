import * as actions from "../../utils/constants/actions";

const initialState = {
  centers: {},
  isFetching: false,
};

const center = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_CENTER:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_CENTER_DONE:
      return { ...state, centers: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default center;
