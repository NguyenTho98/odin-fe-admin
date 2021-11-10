import * as actions from "../../utils/constants/actions";

const initialState = {
  assignments: {},
  isFetching: false,
};

const assignment = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ASSIGNMENT:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ASSIGNMENT_DONE:
      return { ...state, assignments: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default assignment;
