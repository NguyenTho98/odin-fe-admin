import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ROLES, routes } from "../utils/constants/config";
import {
  Login,
  Lesson,
  Session,
  Material,
  Assignment,
  Exam,
  Quizz,
  NotFound,
  User,
  Role,
  Api,
  Room,
  RoomDetail,
  Billing,
  Voucher,
  Revenue,
  EditRevenue,
  AddRevenue,
  Blog,
  AddBlog,
  EditBlog,
  Order,
  Student,
  StudentDetail,
  RevenueDebt,
  Mentor,
  AddMentor,
  EditMentor,
  OrdersMentor,
  Asset,
  UserLesson,
  Center,
  Classes,
  ClassRoom,
  Course,
} from "../pages";
import { hasPermission, hasRole } from "../utils/helpers";
import { permission } from "../utils/constants/permission";
import UserProfile from "../pages/userProfile";
import Dashboard from "../pages/dashboard/Dashboard";
import Website from "../pages/website";

const Routes = (props) => {
  const { profile } = props;

  return (
    <Switch>
      <Redirect exact from="/" to={routes.LOGIN} />
      <Route exact path={routes.LOGIN} component={Login} />
      <Route path={routes.IDS_PROFILE} component={UserProfile} />
      
      {!hasPermission(profile, [permission.lesson_search]) && (
        <Route exact path={routes.LESSON} component={Lesson} />
      )}
      {!hasPermission(profile, [permission.session_search]) && (
        <Route exact path={routes.SESSION} component={Session} />
      )}
      {!hasPermission(profile, [permission.material_search]) && (
        <Route exact path={routes.MATERIAL} component={Material} />
      )}
      {!hasPermission(profile, [permission.assignment_search]) && (
        <Route exact path={routes.ASSIGNMENT} component={Assignment} />
      )}
      {!hasPermission(profile, [permission.asset_search]) && (
        <Route exact path={routes.ASSET} component={Asset} />
      )}
      {!hasPermission(profile, [permission.userLesson_search]) && (
        <Route exact path={routes.USER_LESSON} component={UserLesson} />
      )}
      {!hasPermission(profile, [permission.exam_search]) && (
        <Route exact path={routes.EXAM} component={Exam} />
      )}
      {!hasPermission(profile, [permission.quizz_search]) && (
        <Route exact path={routes.QUIZZ} component={Quizz} />
      )}
      {!hasPermission(profile, [permission.user_search]) && (
        <Route exact path={routes.USER} component={User} />
      )}
      {!hasPermission(profile, [permission.role_search]) && (
        <Route exact path={routes.ROLE} component={Role} />
      )}
      {!hasPermission(profile, [permission.api_search]) && (
        <Route exact path={routes.API} component={Api} />
      )}
      {!hasPermission(profile, [permission.room_search]) && (
        <Route exact path={routes.ROOM} component={Room} />
      )}
      {!hasPermission(profile, [permission.room_search]) && (
        <Route exact path={routes.ROOM_DETAIL} component={RoomDetail} />
      )}
      {!hasPermission(profile, [permission.billing_search]) && (
        <Route exact path={routes.BILLING} component={Billing} />
      )}
      {!hasPermission(profile, [permission.voucher_search]) && (
        <Route exact path={routes.VOUCHER} component={Voucher} />
      )}
      {!hasPermission(profile, [permission.revenue_search]) && (
        <Route exact path={routes.REVENUE} component={Revenue} />
      )}
      {!hasPermission(profile, [permission.revenue_search]) && (
        <Route exact path={routes.REVENUE_DEBT} component={RevenueDebt} />
      )}
      {!hasPermission(profile, [permission.revenue_search]) && (
        <Route exact path={routes.REVENUE_DETAIL} component={EditRevenue} />
      )}
      {!hasPermission(profile, [permission.revenue_search]) && (
        <Route exact path={routes.REVENUE_ADD} component={AddRevenue} />
      )}
      {hasRole(profile, [
        ROLES.CONTENT_ADMIN,
        ROLES.CONTENT_USER,
        ROLES.SUPER_ADMIN,
      ]) && <Route exact path={routes.BLOG} component={Blog} />}
      {hasRole(profile, [
        ROLES.CONTENT_ADMIN,
        ROLES.CONTENT_USER,
        ROLES.SUPER_ADMIN,
      ]) && <Route exact path={routes.BLOG_ADD} component={AddBlog} />}
      {hasRole(profile, [
        ROLES.CONTENT_ADMIN,
        ROLES.CONTENT_USER,
        ROLES.SUPER_ADMIN,
      ]) && <Route exact path={routes.BLOG_DETAIL} component={EditBlog} />}
      {!hasPermission(profile, [permission.student_search]) && (
        <Route exact path={routes.STUDENT} component={Student} />
      )}
      {!hasPermission(profile, [permission.student_search]) && (
        <Route exact path={routes.STUDENT_DETAIL} component={StudentDetail} />
      )}
      {!hasPermission(profile, [permission.orders_search]) && (
        <Route exact path={routes.ORDERS} component={Order} />
      )}
      {!hasPermission(profile, [permission.mentor_search]) && (
        <Route exact path={routes.MENTOR} component={Mentor} />
      )}
      {!hasPermission(profile, [permission.mentor_add]) && (
        <Route exact path={routes.MENTOR_ADD} component={AddMentor} />
      )}
      {!hasPermission(profile, [permission.mentor_update]) && (
        <Route exact path={routes.MENTOR_DETAIL} component={EditMentor} />
      )}
      {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.ORDERS_MENTOR} component={OrdersMentor} />
      )}
      {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.CENTER} component={Center} />
      )}
      {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.CLASSES} component={Classes} />
      )}
      {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.CLASSROOM} component={ClassRoom} />
      )}
       {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.COURSES} component={Course} />
      )}
       {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.DASHBOARD} component={Dashboard} />
      )}
       {!hasPermission(profile, [permission.ordersMentorAdmin_search]) && (
        <Route exact path={routes.WEBSITE} component={Website} />
      )}
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default connect(
  (state) => ({
    profile: state.system.profile,
  }),
  {}
)(Routes);
