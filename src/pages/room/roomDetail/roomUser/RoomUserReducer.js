import * as actions from "../../../../utils/constants/actions";

const initialState = {
  roomUsers: {},
  isFetching: false,
};

const roomUser = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ROOM_USER:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ROOM_USER_DONE:
      return { ...state, roomUsers: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default roomUser;
