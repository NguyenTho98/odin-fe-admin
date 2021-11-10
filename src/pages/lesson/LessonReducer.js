import * as actions from "../../utils/constants/actions";

const initialState = {
  lessons: {},
  isFetching: false,
};

const lesson = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_LESSON:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_LESSON_DONE:
      return { ...state, lessons: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default lesson;
