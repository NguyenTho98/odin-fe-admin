import * as actions from "../../utils/constants/actions";

const initialState = {
  assets: {},
  isFetching: false,
};

const asset = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ASSET:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ASSET_DONE:
      return { ...state, assets: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default asset;
