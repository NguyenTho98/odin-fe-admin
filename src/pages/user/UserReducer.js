import * as actions from "../../utils/constants/actions";

const initialState = {
  users: {},
  isFetching: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_USERS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_USERS_DONE:
      return { ...state, users: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default user;
