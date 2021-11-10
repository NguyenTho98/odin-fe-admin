import { combineReducers } from "redux";
import system from "../pages/system/systemReducer";
import course from "../pages/course/CourseReducer";
import lesson from "../pages/lesson/LessonReducer";
import session from "../pages/session/SessionReducer";
import material from "../pages/material/MaterialReducer";
import assignment from "../pages/assignment/AssignmentReducer";
import slide from "../pages/slide/SlideReducer";
import exam from "../pages/exam/ExamReducer";
import quizz from "../pages/quizz/QuizzReducer";
import user from "../pages/user/UserReducer";
import role from "../pages/role/RoleReducer";
import api from "../pages/api/ApiReducer";
import roomUser from "../pages/room/roomDetail/roomUser/RoomUserReducer";
import roomMentor from "../pages/room/roomDetail/roomMentor/RoomMentorReducer";
import room from "../pages/room/RoomReducer";
import student from "../pages/student/StudentReducer";
import billing from "../pages/billing/BillingReducer";
import voucher from "../pages/voucher/VoucherRuducer";
import asset from "../pages/asset/AssetReducer";
import revenue from "../pages/revenue/RevenueReducer";
import order from "../pages/order/OrderReducer";
import mentor from "../pages/mentor/MentorReducer";
import userLesson from "../pages/userLesson/UserLessonReducer";
import orderMentor from "../pages/ordersMentor/OrdersMentorReducer";
//trung tâm
import center from "../pages/center/CenterReducer";
import classes from "../pages/classes/ClassesReducer";
import classRoom from "../pages/classRoom/ClassRoomReducer";


const rootReducer = combineReducers({
  system,
  course,
  lesson,
  session,
  material,
  assignment,
  slide,
  exam,
  quizz,
  user,
  role,
  api,
  roomUser,
  roomMentor,
  room,
  billing,
  voucher,
  revenue,
  student,
  order,
  mentor,
  orderMentor,
  asset,
  userLesson,
  center,
  classes,
  classRoom,
});

export default rootReducer;
