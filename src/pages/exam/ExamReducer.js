import * as actions from "../../utils/constants/actions";

const initialState = {
  exams: {},
  isFetching: false,
};

const exam = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_EXAMS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_EXAMS_DONE:
      return { ...state, exams: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default exam;
