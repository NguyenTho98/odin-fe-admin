// common
export const TOKEN = "cms-token";
export const EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24h
export const LMS_PLUS_LOCALE = "lms-plus-locale";

export const CONFIG_SERVER = {
  BASE_URL: process.env.BASE_URL || window.origin,
};

// routes
export const routes = {
  LOGIN: "/login",
  WEBSITE: "/website",
  DASHBOARD: "/dashboard",
  LOGOUT: "/logout",
  USER_PROFILE: "/profile/info",
  CHANGE_PASSWORD: "/profile/password",
  COURSES: "/courses",
  COURSES_ADD: "/courses-add",
  COURSES_DETAIL: "/courses/:courseId",
  LESSON: "/lesson",
  SESSION: "/session",
  MATERIAL: "/material",
  ASSIGNMENT: "/assignment",
  EXAM: "/exam",
  QUIZZ: "/quizz",
  USER: "/user",
  ROLE: "/role",
  API: "/api",
  ROOM: "/room",
  ROOM_DETAIL: "/room/:roomId",
  BILLING: "/billing",
  ORDERS: "/orders",
  ORDERS_MENTOR: "/orders-mentor",
  MENTOR: "/mentor",
  MENTOR_ADD: "/mentor-add",
  MENTOR_DETAIL: "/mentor/:mentorId",
  VOUCHER: "/voucher",
  IDS_PROFILE: "/profile",
  REVENUE: "/revenue",
  REVENUE_DEBT: "/debt",
  REVENUE_ADD: "/revenue-add",
  REVENUE_DETAIL: "/revenue/:revenueId",
  BLOG: "/blog",
  BLOG_ADD: "/blog-add",
  BLOG_DETAIL: "/blog/:blogId",
  STUDENT: "/student",
  STUDENT_DETAIL: "/student/:studentId",
  ASSET: "/asset",
  USER_LESSON: "/user-lesson",
  //Trung tâm
  CENTER: "/center",
  CLASSES: "/classes",
  CLASSROOM: "/classroom",
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
  CONTENT_ADMIN: "CONTENT_ADMIN",
  CONTENT_USER: "CONTENT_USER",
};

export const COURSE_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const ASSET_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};
export const USER_LESSON_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const LESSON_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const REVENUE_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const STUDENT_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const SESSION_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const MATERIAL_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const ASSIGNMENT_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};
export const BILLING_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};
export const VOUCHER_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const SLIDE_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const USER_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const QUIZZ_QUESTION_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const EXAM_QUESTION_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const ITEM_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  DONE: "DONE",
};

export const ORDERS_STATUS = {
  PENDING: "PENDING",
  DONE: "DONE",
  REJECTED: "REJECTED",
  DELETED: "DELETED",
};

export const ROOM_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const ROLE_STATUS = {
  DRAFF: "DRAFF",
  ACTIVE: "ACTIVE",
};

export const EXAM_TYPE = {
  INPUT: "INPUT",
  MID_TERM: "MID_TERM",
  OUTPUT: "OUTPUT",
};

export const QUIZZ_TYPE = {
  FIRST: "FIRST",
  MID: "MID",
  END: "END",
};

export const LESSON_TYPE = {
  KNOWLEDGE: "KNOWLEDGE",
  PRACTICE: "PRACTICE",
};

export const API_TYPE = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  PATCH: "PATCH",
};

export const SESSION_TYPE = {
  INSTRUCTOR: "INSTRUCTOR",
  SELFSTUDY: "SELF_STUDY",
  DISCUSSION: "DISCUSSION",
};

export const MATERIAL_TYPE = {
  SLIDE: "SLIDE",
  VIDEO: "VIDEO",
  PDF: "PDF",
};

export const ASSIGNMENT_TYPE = {
  NORMAL: "NORMAL",
  ADVANCE: "ADVANCE",
};

export const QUIZZ_QUESTION_TYPE = {
  RADIO: "RADIO",
  MULTI_CHOICE_2: "MULTI_CHOICE_2",
  MULTI_CHOICE_3: "MULTI_CHOICE_3",
  MULTI_CHOICE_4: "MULTI_CHOICE_4",
  TEXT: "TEXT",
};

export const EXAM_QUESTION_TYPE = {
  RADIO: "RADIO",
  MULTI_CHOICE_2: "MULTI_CHOICE_2",
  MULTI_CHOICE_3: "MULTI_CHOICE_3",
  MULTI_CHOICE_4: "MULTI_CHOICE_4",
  TEXT: "TEXT",
};

export const QUESTION_TYPE = [
  "RADIO",
  "MULTI_CHOICE_2",
  "MULTI_CHOICE_3",
  "MULTI_CHOICE_4",
  "TEXT",
];
