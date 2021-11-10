import * as actions from "../../utils/constants/actions";

const initialState = {
  materials: {},
  isFetching: false,
};

const material = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_MATERIALS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_MATERIALS_DONE:
      return { ...state, materials: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default material;
