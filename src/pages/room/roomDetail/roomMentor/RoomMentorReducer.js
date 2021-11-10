import * as actions from "../../../../utils/constants/actions";

const initialState = {
  roomMentors: {},
  isFetching: false,
};

const roomMentor = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_ROOM_MENTOR:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_ROOM_MENTOR_DONE:
      return { ...state, roomMentors: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default roomMentor;
