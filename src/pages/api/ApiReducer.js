import * as actions from "../../utils/constants/actions";

const initialState = {
  apis: {},
  isFetching: false,
};

const api = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_APIS:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_APIS_DONE:
      return { ...state, apis: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default api;
