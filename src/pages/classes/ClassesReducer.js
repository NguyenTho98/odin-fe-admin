import * as actions from "../../utils/constants/actions";

const initialState = {
  classess: {},
  isFetching: false,
};

const classes = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_CLASSES:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_CLASSES_DONE:
      return { ...state, classess: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default classes;
