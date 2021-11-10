import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetUserLessons =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_USER_LESSON, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/user-lesson/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_USER_LESSON_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_USER_LESSON, payload: false });
    }
  };
export const getUserLessonList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/user-lesson/search`,
    params,
  });
};
export const actionAddUserLesson = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/user-lesson`,
    data,
  });
};

export const actionEditUserLesson = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/user-lesson/${id}`,
    data,
  });
};

export const actionDeleteUserLesson = (id) => {
  return api({
    method: "delete",
    url: `/admin/user-lesson/${id}`,
  });
};

export const actionUploadUserLessonLink = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
