import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetStudents =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_STUDENT, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/user/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_STUDENT_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_STUDENT, payload: false });
    }
  };
export const getStudentList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/student/search`,
    params,
  });
};
export const actionAddStudent = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/student`,
    data,
  });
};

export const actionEditStudent = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/student/${id}`,
    data,
  });
};

export const actionDeleteStudent = (id) => {
  return api({
    method: "delete",
    url: `/admin/student/${id}`,
  });
};

export const actionUploadStudentAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};

export const getStudentDetail = (studentId) => {
  return api({
    method: "get",
    url: `/admin/user/search`,
    params: {
      query: `id=="${studentId}"`,
    },
  });
};

export const getStudentHistory = (studentId) => {
  return api({
    method: "get",
    url: `/admin/revenue/search`,
    params: {
      query: `userId=="${studentId}"`,
    },
  });
};

export const getStudentBill = (studentId) => {
  return api({
    method: "get",
    url: `/admin/billing/search`,
    params: {
      query: `userId=="${studentId}"`,
    },
  });
};

export const getStudentCourse = (studentId) => {
  return api({
    method: "get",
    url: `/admin/course/user/${studentId}`,
  });
};
