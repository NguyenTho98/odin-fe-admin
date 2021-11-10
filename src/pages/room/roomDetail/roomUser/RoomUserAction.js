import api from "../../../../utils/service/api";
import * as actionType from "../../../../utils/constants/actions";

export const actionGetRoomUsers = (roomId) => async (dispatch) => {
  try {
    dispatch({ type: actionType.FETCHING_ROOM_USER, payload: true });
    const { data = {} } = await api({
      method: "get",
      url: `/admin/room-user/${roomId}`,
    });

    dispatch({ type: actionType.FETCH_ROOM_USER_DONE, payload: data });
  } catch (error) {
    dispatch({ type: actionType.FETCHING_ROOM_USER, payload: false });
  }
};

export const actionAddRoomUsers = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/room-user`,
    data,
  });
};

export const actionDeleteRoomUsers = (data = {}) => {
  return api({
    method: "delete",
    url: "/admin/room-user",
    data,
  });
};

export const getRoomUsers = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/room-user`,
    params,
  });
};
