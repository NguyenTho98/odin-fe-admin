import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetRooms =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ROOM, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/room/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ROOM_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_ROOM, payload: false });
    }
  };
export const getRoomList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/room/search`,
    params,
  });
};
export const actionAddRoom = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/room`,
    data,
  });
};

export const actionEditRoom = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/room/${id}`,
    data,
  });
};

export const actionDeleteRoom = (id) => {
  return api({
    method: "delete",
    url: `/admin/room/${id}`,
  });
};

export const actionUploadRoomAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};

export const getRoomDetail = (roomId) => {
  return api({
    method: "get",
    url: `/admin/room/search`,
    params: {
      query: `id=="${roomId}"`,
    },
  });
};
