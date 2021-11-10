import React, { useState } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Divider, message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import "./ChangePassword.scss";
import { actionChangePassword } from "../actions";

const ChangePassword = (props) => {
  const { profile = {} } = props;
  const [form] = Form.useForm();
  const [isProcessing, setProcessing] = useState(false);

  const onFinish = async (values) => {
    if (isProcessing) return;
    try {
      setProcessing(true);
      delete values?.confirm;
      await actionChangePassword(profile.id, values);
      form.resetFields();
      setProcessing(false);
      message.success("Thay đổi mật khẩu thành công!");
    } catch (error) {
      setProcessing(false);
      message.error("Thay đổi mật khẩu thất bại!");
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 10 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
      md: {
        span: 24,
        offset: 0,
      },
      lg: { offset: 6, span: 10 },
    },
  };

  return (
    <div className="change-password-page common-sub-user-page">
      <div className="header-section">
        <div className="header-lb-title">Thay đổi mật khẩu</div>
        <Divider />
      </div>
      <Spin spinning={isProcessing}>
        <Form
          {...formItemLayout}
          form={form}
          name="changePassword"
          onFinish={onFinish}
          scrollToFirstError
          hideRequiredMark
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
            ]}
            hasFeedback
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Xác nhận lại mật khẩu mới"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu mới!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu không trùng khớp với nhau!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" className="btn-save">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
  }),
  { actionChangePassword }
)(withRouter(ChangePassword));
