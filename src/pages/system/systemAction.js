import cookie from "js-cookie";
import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";
import { routes, LMS_PLUS_LOCALE } from "../../utils/constants/config";

export const actionChangeLanguage = (lang) => {
  cookie.set(LMS_PLUS_LOCALE, lang);
  return {
    type: actionType.CHANGE_LANGUAGE,
    payload: lang,
  };
};

export const actionToggleLoading = (isLoading = false) => {
  return {
    type: actionType.TOGGLE_LOADING,
    payload: isLoading,
  };
};

export const getUserInfo = (history) => async (dispatch) => {
  try {
    dispatch(actionToggleLoading(true));
    const { data } = await api({
      method: "get",
      url: `/profile/users`,
    });

    dispatch({ type: actionType.FETCH_PROFILE, payload: data?.results });
    dispatch(actionToggleLoading(false));

    if (history) {
      history.push("/dashboard");
    }
  } catch (error) {
    console.log(error);
    dispatch(actionToggleLoading(false));
  }
};

export const actionUploadFile = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
