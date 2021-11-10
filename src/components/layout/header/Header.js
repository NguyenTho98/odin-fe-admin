/* eslint-disable eqeqeq */
import React from "react";
import { Menu, Dropdown, Layout, Avatar } from "antd";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import cookie from "js-cookie";
import { routes, TOKEN } from "../../../utils/constants/config";
import "./Header.scss";

const Header = (props) => {
  const { account, isCollapsed, onToggleSider } = props;

  const handleClickAvatar = (item = {}) => {
    if (item.key === routes.LOGOUT) {
      cookie.remove(TOKEN);
      window.location.href = routes.LOGIN;
    }
    if(item.key === routes.USER_PROFILE) {
      props.history.push(routes.USER_PROFILE);
    }
  };

  const menu = (
    <Menu onClick={handleClickAvatar}>
      <Menu.Item key={routes.USER_PROFILE}>
        <FormattedMessage id="IDS_PROFILE" />
      </Menu.Item>
      <Menu.Item key={routes.LOGOUT}>
        <FormattedMessage id="IDS_LOGOUT" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header>
      <div className="header-container">
        <div className="header-left-content">
          <span className="collapse-icon" onClick={onToggleSider}>
            {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
        <div className="header-right-content" xs={18} sm={18}>
          <Dropdown overlay={menu}>
            <div className="user-info">
              <span className="user-name">{account?.userName}</span>
              <Avatar size={36} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </div>
      </div>
    </Layout.Header>
  );
};

export default connect(
  (state) => ({
    account: state.system.profile,
  }),
  {}
)(withRouter(Header));
