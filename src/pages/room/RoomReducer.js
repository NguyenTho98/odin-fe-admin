import * as actions from "../../utils/constants/actions";

const initialState = {
  rooms: {},
  isFetching: false,
};

const room = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ROOM:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ROOM_DONE:
      return { ...state, rooms: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default room;
