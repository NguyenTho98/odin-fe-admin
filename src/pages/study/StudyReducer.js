import * as actions from "../../utils/constants/actions";

const initialState = {
  studys: {},
  isFetching: false,
};

const study = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_STUDY:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_STUDY_DONE:
      return { ...state, studys: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default study;
