import * as actions from "../../utils/constants/actions";

const initialState = {
  mentorList: {},
  isFetching: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_MENTOR:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_MENTOR_DONE:
      return { ...state, mentorList: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default user;
