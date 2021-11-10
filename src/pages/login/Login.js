import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import cookie from "js-cookie";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { text_plus } from "../../assets";
import { EXPIRE_TIME, TOKEN } from "../../utils/constants/config";
import { actionLogin } from "./LoginAction";
import { getUserInfo } from "../system/systemAction";
import { useHistory } from "react-router-dom";
import "./Login.scss";

export const Login = (props) => {
  let history = useHistory(); 
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (values) => {
    if (processing) return;
    try {
      setProcessing(true);
      history.push("/dashboard");
      const { data = {} } = await actionLogin({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });
      if (data.key) {
        // cookie.set(TOKEN, data.key, {
        //   expires: new Date(data.data.expiredTime || EXPIRE_TIME + Date.now()),
        // });
        cookie.set(TOKEN, data.key)
        // get user info
        props.getUserInfo(props.history);
      }
      setProcessing(false);
    } catch (error) {
      message.error("Tên đăng nhập hoặc mật khẩu không chính xác!");
      setProcessing(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page login-container">
      <div className="login-warpper">
        <Form
          name="loginForm"
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          className="login-form"
        >
          <div className="txt-plus">
            <img src={text_plus} alt="" className="img-plus"></img>
          </div>
          <Form.Item
            name="username"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Vui lòng nhập tên đăng nhập!",
              },
            ]}
            className="login-form-item"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên đăng nhập"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Vui lòng nhập email đăng nhập!",
              },
            ]}
            className="login-form-item"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
            className="login-form-item"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item className="action-btn-group">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="btn-login"
              loading={processing}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default connect(() => ({}), { getUserInfo })(withRouter(Login));
