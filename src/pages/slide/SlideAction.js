import api from "../../utils/service/api";

export const actionGetSlides =(params = {}) => {
    return api({
      method: "get",
      url: `/admin/slide/search`,
      params,
    });
};
export const getSlideList = (params = {}) => {
  return api({
    method: "get",
    url: `/admin/slide/search`,
    params,
  });
};
export const actionAddSlide = (data = {}) => {
  return api({
    method: "post",
    url: `/admin/slide`,
    data,
  });
};

export const actionEditSlide = (data = {}, id) => {
  return api({
    method: "put",
    url: `/admin/slide/${id}`,
    data,
  });
};

export const actionDeleteSlide = (id) => {
  return api({
    method: "delete",
    url: `/admin/slide/${id}`,
  });
};

export const actionUploadSlideAvatar = (formData) => {
  return api({
    method: "post",
    url: `/admin/file/upload`,
    data: formData,
  });
};
