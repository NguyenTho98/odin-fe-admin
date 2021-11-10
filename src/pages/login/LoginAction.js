import api from "../../utils/service/api";

export const actionLogin = (data = {}) => {
  return api({
    method: "post",
    url: "/auth/login",
    data,
  });
};
