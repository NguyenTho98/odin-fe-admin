import api from "../../utils/service/api";

export const actionGetBlog = (params = {}) => {
  return api({
    method: "get",
    url: `admin/blogs/search`,
    params,
  });
};

export const actionGetCategories = (params = {}) => {
  return api({
    method: "get",
    url: `admin/blogs/cate`,
    params,
  });
};

export const actionAddBlog = (data = {}) => {
  return api({
    method: "post",
    url: `admin/blogs`,
    data,
  });
};

export const actionUpdateBlog = (data = {}, id) => {
  return api({
    method: "put",
    url: `admin/blogs/update/${id}`,
    data,
  });
};

export const actionDeleteItem = (id) => {
  return api({
    method: "delete",
    url: `admin/blogs/${id}`,
  });
};

export const actionGetBlogDetail = (id) => {
  return api({
    method: "get",
    url: `admin/blogs/detail/${id}`,
  });
};

export const actionApproveItem = (data = {}) => {
  return api({
    method: "put",
    url: `admin/blogs/approve`,
    data,
  });
};
