import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Divider, message, Input, Button, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { actionUpdateUserInfo, fetchNewUserInfo } from "../actions";
import { isEmpty } from "./../../../utils/helpers";
import "./Profile.scss";

const Profile = (props) => {
  const { profile, fetchNewUserInfo } = props;
  const [form] = Form.useForm();
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isEmpty(profile)) {
      form.setFieldsValue(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onFinish = async (values) => {
    if (isProcessing) return;
    try {
      setProcessing(true);
      await actionUpdateUserInfo(profile?.id, values);
      message.success("Cập nhật thông tin thành công!");
      setProcessing(false);
      fetchNewUserInfo();
    } catch (error) {
      setProcessing(false);
      message.error("Cập nhật thông tin thất bại!");
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
    <div className="profile-page common-sub-user-page">
      <div className="header-section">
        <div className="header-lb-title">Thông tin cá nhân</div>
        <Divider />
      </div>
      <Spin spinning={isProcessing}>
        <Form
          {...formItemLayout}
          form={form}
          name="profile"
          onFinish={onFinish}
          scrollToFirstError
          hideRequiredMark
        >
          <Form.Item name="userName" label="Tên đăng nhập">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "E-mail không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: new RegExp(
                  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                ),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input />
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
  }),{
    actionUpdateUserInfo, fetchNewUserInfo
  }
)(withRouter(Profile));
