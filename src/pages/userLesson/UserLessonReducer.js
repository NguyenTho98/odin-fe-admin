import * as actions from "../../utils/constants/actions";

const initialState = {
  userLessons: {},
  isFetching: false,
};

const userLesson = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_USER_LESSON:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_USER_LESSON_DONE:
      return { ...state, userLessons: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default userLesson;
