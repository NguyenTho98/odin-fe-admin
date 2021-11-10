import React from "react";
import { Route } from "react-router-dom";
import { Layout } from "antd";
import SiderUser from "./siderUser";
import { routes } from "../../utils/constants/config";
import Profile from "./profile";
import ChangePassword from "./changePassword";
import "./User.scss";

const { Content } = Layout;

function User(props) {
  return (
    <Layout className="user-page">
      <SiderUser />
      <Content className="user-content">
        <Route path={routes.USER_PROFILE} component={Profile} />
        <Route path={routes.CHANGE_PASSWORD} component={ChangePassword} />
      </Content>
    </Layout>
  );
};

export default User;
