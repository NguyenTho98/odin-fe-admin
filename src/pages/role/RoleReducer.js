import * as actions from "../../utils/constants/actions";

const initialState = {
  roles: {},
  isFetching: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ROLES:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ROLES_DONE:
      return { ...state, roles: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default user;
