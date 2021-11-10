import * as actions from "../../utils/constants/actions";

const initialState = {
  slides: {},
  isFetching: false,
};

const slide = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_SLIDE:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_SLIDE_DONE:
      return { ...state, slides: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default slide;
