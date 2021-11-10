import * as actions from "../../utils/constants/actions";

const initialState = {
  classRooms: {},
  isFetching: false,
};

const classRoom = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_CLASSROOM:
      return { ...state, isFetching: action.payload || false };
    case actions.FETCH_CLASSROOM_DONE:
      return { ...state, classRooms: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default classRoom;
