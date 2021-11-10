import api from "../../../../utils/service/api";
import * as actionType from "../../../../utils/constants/actions";

export const actionGetRoomMentors = (roomId) => async (dispatch) => {
  try {
    dispatch({ type: actionType.FETCHING_ROOM_MENTOR, payload: true });
    const { data = {} } = await api({
      method: "get",
      url: `/admin/room-mentor/${roomId}`,
    });

    dispatch({ type: actionType.FETCH_ROOM_MENTOR_DONE, payload: data });
  } catch (error) {
    dispatch({ type: actionType.FETCHING_ROOM_MENTOR, payload: false });
  }
};

export const actionAddRoomMentors = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/room-mentor`,
    data,
  });
};

export const actionUpdateRoomMentors = (data = {}, params = {}) => {
  return api({
    method: "put",
    url: `/admin/room-mentor`,
    data,
    params,
  });
};

export const actionDeleteRoomMentors = (data = {}) => {
  return api({
    method: "delete",
    url: "/admin/room-mentor",
    data,
  });
};

export const getRoomMentors = () => {
  return api({
    method: "get",
    url: `/admin/room-mentor`,
  });
};
