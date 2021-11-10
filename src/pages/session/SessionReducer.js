import * as actions from "../../utils/constants/actions";

const initialState = {
  sessions: {},
  isFetching: false,
};

const session = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_SESSIONS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_SESSIONS_DONE:
      return { ...state, sessions: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default session;
