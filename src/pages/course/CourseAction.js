import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetCourses =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_COURSE, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/course`,
        params,
      });

      dispatch({ type: actionType.FETCH_COURSE_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_COURSE, payload: false });
    }
  };
export const getCourseList = (params = {}) => {
  return api({
    method: "get",
    url: `/course`,
    params,
  });
};
export const actionAddCourse = (data = {}) => {
  return api({
    method: "post",
    url: `/course`,
    data,
  });
};

export const actionEditCourse = (data = {}, id) => {
  return api({
    method: "put",
    url: `/course/${id}`,
    data,
  });
};

export const actionDeleteCourse = (id) => {
  return api({
    method: "delete",
    url: `/course/${id}`,
  });
};

export const actionUploadCourseAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
