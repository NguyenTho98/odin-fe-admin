import * as actions from "../../utils/constants/actions";

const initialState = {
  quizzes: {},
  isFetching: false,
};

const quizz = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_QUIZZES:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_QUIZZES_DONE:
      return { ...state, quizzes: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default quizz;
