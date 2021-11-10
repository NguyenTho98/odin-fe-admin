import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetLessons =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_LESSON, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/lesson/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_LESSON_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_LESSON, payload: false });
    }
  };
export const getLessonList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/lesson/search`,
    params,
  });
};
export const actionAddLesson = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/lesson`,
    data,
  });
};

export const actionEditLesson = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/lesson/${id}`,
    data,
  });
};

export const actionDeleteLesson = (id) => {
  return api({
    method: "delete",
    url: `/admin/lesson/${id}`,
  });
};

export const actionUploadLessonAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
