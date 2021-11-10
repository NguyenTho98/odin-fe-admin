import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Divider, Layout, Menu, Upload, Avatar } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { withRouter } from "react-router-dom";
import { routes } from "../../../utils/constants/config";
import { actionUploadFile } from "../../system/systemAction";
import "./SiderUser.scss";
import { actionUpdateUserInfo, fetchNewUserInfo } from "../actions";
const { Sider } = Layout;

const SiderUser = (props) => {
  const { history, location, profile, fetchNewUserInfo } = props;
  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    if (location?.pathname !== selectedMenu) {
      setSelectedMenu(location?.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleChangeMenu = ({ key }) => {
    history.push(key);
  };

  const handleUploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      const { data } = await actionUploadFile(formData);
      if (data.data[0]) {
        await actionUpdateUserInfo(profile?.id, { avatar: data.data[0] });
        fetchNewUserInfo();
      }
    } catch (error) {}
  };

  const propsUpload = {
    showUploadList: false,
    accept: "image/jpeg, image/png",
    beforeUpload: (file) => {
      handleUploadFile(file);
      return false;
    },
  };

  return (
    <Sider
      width={200}
      theme="light"
      breakpoint="sm"
      collapsedWidth="0"
      className="sider-user-content"
    >
      <div className="profile-header">
        <div className="avatar-wrapper">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={profile.avatar || ""}
          ></Avatar>
          <div className="btn-upload-img">
            <ImgCrop
              rotate
              modalTitle="Chỉnh sửa hình ảnh"
              modalOk="Tải lên"
              modalCancel="Hủy bỏ"
              className="crop-avatar-modal"
            >
              <Upload {...propsUpload}>
                <CameraOutlined />
              </Upload>
            </ImgCrop>
          </div>
        </div>
        <div className="user-name">{profile.fullName || profile.userName}</div>
        <div className="e-mail">{profile?.email || ""}</div>
      </div>
      <Divider />
      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        onClick={handleChangeMenu}
      >
        <Menu.Item key={routes.USER_PROFILE} icon={<UserOutlined />}>
          Thông tin cá nhân
        </Menu.Item>
        <Menu.Item key={routes.CHANGE_PASSWORD} icon={<LockOutlined />}>
          Thay đổi mật khẩu
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
  }),
  {actionUpdateUserInfo , fetchNewUserInfo}
)(withRouter(SiderUser));
