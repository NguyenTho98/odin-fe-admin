import api from "../../utils/service/api";
import * as actionType from "../../utils/constants/actions";

export const actionGetAssignments =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.FETCHING_ASSIGNMENT, payload: true });
      const { data = {} } = await api({
        method: "get",
        url: `/admin/assignment/search`,
        params,
      });

      dispatch({ type: actionType.FETCH_ASSIGNMENT_DONE, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionType.FETCHING_ASSIGNMENT, payload: false });
    }
  };
export const getAssignmentList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/assignment/search`,
    params,
  });
};
export const actionAddAssignment = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/assignment`,
    data,
  });
};

export const actionEditAssignment = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/assignment/${id}`,
    data,
  });
};

export const actionDeleteAssignment = (id) => {
  return api({
    method: "delete",
    url: `/admin/assignment/${id}`,
  });
};

export const actionUploadAssignmentLink = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
