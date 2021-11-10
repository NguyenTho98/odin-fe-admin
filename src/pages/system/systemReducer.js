import cookie from "js-cookie";
import { LMS_PLUS_LOCALE } from "../../utils/constants/config";
import * as actions from "../../utils/constants/actions";

const initialState = {
  locale: cookie.get(LMS_PLUS_LOCALE) || "vi",
  isLoading: false,
  profile: {},
};

const system = (state = initialState, action) => {
  switch (action.type) {
    case actions.CHANGE_LANGUAGE:
      return { ...state, locale: action.payload };
    case actions.TOGGLE_LOADING:
      return { ...state, isLoading: action.payload };
    case actions.FETCH_PROFILE:
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

export default system;
