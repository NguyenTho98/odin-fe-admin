import * as actions from "../../utils/constants/actions";

const initialState = {
  courses: {},
  isFetching: false,
};

const course = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_COURSE:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_COURSE_DONE:
      return { ...state, courses: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default course;
