const has = Object.prototype.hasOwnProperty;

export const isDiff = (A, B) => JSON.stringify(A) !== JSON.stringify(B);

export const isEmpty = (prop) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, "length") && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
};

export const groupQuestions = (fieldsValue = {}) => {
  let data = {};
  Object.keys(fieldsValue).forEach((key) => {
    const splitKey = key.split("_");
    const idx = splitKey[0];
    const fieldName = splitKey[1];
    if (data[idx]) {
      data[idx][fieldName] = fieldsValue[key];
    } else {
      data[idx] = { [fieldName]: fieldsValue[key] };
    }
  });
  return data;
};

export const hasRole = (profile = {}, roleName = []) => {
  const { listRoles = [] } = profile;
  return !!listRoles.find((it) => {
    return roleName.indexOf(it) !== -1;
  });
};

export const hasPermission = (profile = {}, permission = []) => {
  const { listPermissions = [] } = profile;
  return !!listPermissions.find((it) => {
    return permission.indexOf(it) !== -1;
  });
};

export const formatCurrency = (value = 0) => {
  return `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
