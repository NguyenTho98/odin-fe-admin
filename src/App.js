import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import cookie from "js-cookie";
import { connect } from "react-redux";
import Routes from "./routes/Routes";
import { Header, LeftMenu } from "./components/layout";
import { Loading } from "./components";
import { routes, TOKEN } from "./utils/constants/config";
import { getUserInfo } from "./pages/system/systemAction";
import "./App.scss";
import './assets/scss/theme.scss';
const App = (props) => {
  const { location = {}, getUserInfo } = props;
  const [collapsed, setCollapsed] = useState(false);
  const { pathname = "" } = location;
  const isShowCommonUI = pathname.indexOf(routes.LOGIN) === -1;

  // useEffect(() => {
  //   if (!cookie.get(TOKEN) && isShowCommonUI) {
  //     window.location.href = routes.LOGIN;
  //   }
  //   if (cookie.get(TOKEN)) {
  //     getUserInfo();
  //   }
  // }, []);

  const hanldeToggleSider = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);

  return (
    <div className="app-container">
      <Loading />
      <Layout>
        {isShowCommonUI && <LeftMenu isCollapsed={collapsed} />}
        <Layout>
          {isShowCommonUI && (
            <Header isCollapsed={collapsed} onToggleSider={hanldeToggleSider} />
          )}
          <Layout.Content className="content-container">
            <Routes />
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default connect(() => ({}), { getUserInfo })(withRouter(App));
