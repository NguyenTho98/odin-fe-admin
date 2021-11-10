import * as actions from "../../utils/constants/actions";

const initialState = {
  students: {},
  isFetching: false,
};

const student = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_STUDENT:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_STUDENT_DONE:
      return { ...state, students: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default student;
