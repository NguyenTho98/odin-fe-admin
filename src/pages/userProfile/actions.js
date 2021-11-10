import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";
export const actionChangePassword = (userId, data = {}) => {
  return api({
    method: "put",
    url: `/admin/user/change-password?userId=${userId}`,
    data,
  });
};

export const fetchNewUserInfo = () => async (dispatch) => {
  try {
    const { data } = await api({
      method: "get",
      url: `/user/profile`,
    });
    dispatch({ type: actionType.FETCH_PROFILE, payload: data?.data });
  } catch (error) {
    console.log(error);
  }
};

export const actionUpdateUserInfo = (userId, data = {}) => {
  return api({
    method: "put",
    url: `/admin/user/change-info?userId=${userId}`,
    data,
  });
};
